import express from 'express';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import cors from 'cors'
import { clear } from 'console';

const app = express();
app.use(cors())
app.use(express.json());

const exts = {
  'python': '.py',
  'c': '.c',
  'c++': '.cpp'
}

app.post('/python', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }

    // Save the code to a temporary file
    const filename = `sandbox_${Date.now()}.py`;
    const filepath = path.join('/tmp', filename);
    fs.writeFileSync(filepath, code);

    // Run Python inside Firejail with strict security
    const python = spawn('firejail', [
      '--quiet',           // No extra logs
      '--private',         // Isolated filesystem
      '--net=none',        // No network access
      '--rlimit-cpu=2',    // CPU limit: 3 seconds
      //'--rlimit-as=500000', // Memory limit: 50MB
      'python3', filepath
    ]);

    let output = "";
    let error = "";

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', (code) => {
      console.log(output, error)
      fs.unlinkSync(filepath); // Delete temp file

      if (code === 0) {
        return res.json({ output });
      } else {
        return res.status(400).json({ error });
      }
    });

    python.on('error', (err) => {
      fs.unlinkSync(filepath);
      return res.status(500).json({ error: "Execution error: " + err.message });
    });
  } catch (error) {
    return res.status(500).json({ "error": "something went wrong!" })
  }
});


app.post('/c', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }

    const filename = `sandbox_${Date.now()}.c`;
    const filepath = path.join('/tmp', filename);
    const binarypath = path.join('/tmp', filename.replace(".c", ""));
    fs.writeFileSync(filepath, code);

    const compile = spawn("gcc", [filepath, "-o", binarypath]);

    let compileError = "";
    compile.stderr.on("data", (data) => {
      compileError += data.toString();
    });


    compile.on("close", (compileCode) => {
      if (compileCode !== 0) {
        return res.status(400).json({ error: compileError })
        fs.unlinkSync(filepath);
      }

      const run = spawn("firejail", [
        "--private",    // Isolated filesystem
        "--net=none",   // No network access
        "--rlimit-cpu=2", // CPU time limit: 2 seconds
        binarypath
      ]);

      let output = "";
      let error = "";

      run.stdout.on("data", (data) => {
        output += data.toString();
      });

      run.stderr.on("data", (data) => {
        error += data.toString();
      });

      run.on("close", (code) => {

        fs.unlinkSync(filepath);
        fs.unlinkSync(binarypath);
        console.log(output, error, code)
        if (code === 0) {
          return res.json({ output })
        } else {
          return res.status(400).json({ error })
        }

      });
    });
  } catch (error) {
    return res.status(500).json({ "error": "something went wrong!" })
  }
})


app.post('/cpp', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }

    const filename = `sandbox_${Date.now()}.cpp`;
    const filepath = path.join('/tmp', filename);
    const binarypath = path.join('/tmp', filename.replace(".cpp", ""));
    fs.writeFileSync(filepath, code);

    const compile = spawn("g++", [filepath, "-o", binarypath]);

    let compileError = "";
    compile.stderr.on("data", (data) => {
      compileError += data.toString();
    });


    compile.on("close", (compileCode) => {
      if (compileCode !== 0) {
        return res.status(400).json({ error: compileError })
        fs.unlinkSync(filepath);
      }

      const run = spawn("firejail", [
        "--private",    // Isolated filesystem
        "--net=none",   // No network access
        "--rlimit-cpu=2", // CPU time limit: 2 seconds
        binarypath
      ]);

      let output = "";
      let error = "";

      run.stdout.on("data", (data) => {
        output += data.toString();
      });

      run.stderr.on("data", (data) => {
        error += data.toString();
      });

      run.on("close", (code) => {

        console.log(output, error, code)
        if (code === 0) {
          return res.json({ output })
        } else {
          return res.status(400).json({ error })
        }

        fs.unlinkSync(filepath);
        fs.unlinkSync(binarypath);
      });
    });
  } catch (error) {
    res.status(500).json({ "error": "something went wrong!" })
  }
})

app.post("/java", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }

    // 🔹 Find class that contains the main method
    const classMatches = [...code.matchAll(/class\s+(\w+)/g)];
    console.log(classMatches)

    let mainClass = null;

    for (const match of classMatches) {
      const className = match[1];
      const classRegex = new RegExp(`class\\s+${className}[^{]*\\{[^}]*public\\s+static\\s+void\\s+main\\s*\\(`, "s");

      if (classRegex.test(code)) {
        console.log(className)
        mainClass = className;
        break;
      }
    }

    if (!mainClass) {
      return res.status(400).json({ error: "No class with a main method found." });
    }

    // 🔹 Save Java file using the correct class name
    let id = Date.now()

    fs.mkdirSync("/tmp/" + id, { recursive: true });
    const filename = `${id}/${mainClass}.java`;
    const filepath = path.join("/tmp", filename);

    fs.writeFileSync(filepath, code);
    // 🔹 Compile the Java file
    const compile = spawn("javac", [filepath]);

    let compileError = "";
    compile.stderr.on("data", (data) => {
      compileError += data.toString();
    });

    compile.on("close", (compileCode) => {
      if (compileCode !== 0) {
        fs.rmSync("/tmp/" + id, { recursive: true, force: true });
        return res.status(400).json({ error: compileError });
      }

      // 🔹 Run Java inside Firejail with security
      const run = spawn("firejail", [
        "--private",
        "--net=none",
        "--rlimit-cpu=5",
        "java",
        "-cp",
        "/tmp/" + id,
        mainClass,
      ]);

      let output = "";
      let error = "";

      run.stdout.on("data", (data) => {
        output += data.toString();
      });

      run.stderr.on("data", (data) => {
        error += data.toString();
      });

      run.on("close", (code) => {
        console.log(output, error, code)
        fs.rmSync("/tmp/" + id, { recursive: true, force: true });
        if (code === 0) {
          return res.json({ output });
        } else {
          return res.status(400).json({ error });
        }
      });
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Something went wrong!" });
  }
});

app.post('/go', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }

    // Save the code to a temporary file
    const filename = `sandbox_${Date.now()}.go`;
    const filepath = path.join('/tmp', filename);
    console.log(filepath, filename)
    fs.writeFileSync(filepath, code);

    // Run Python inside Firejail with strict security
    const python = spawn('firejail', [
      '--quiet',           // No extra logs
      '--private',         // Isolated filesystem
      '--net=none',        // No network access
      '--rlimit-cpu=19',    // CPU limit: 3 seconds
      //'--rlimit-as=500000', // Memory limit: 50MB
      'go', 'run', filepath
    ]);

    let output = "";
    let error = "";

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', (code) => {
      console.log(output, error)
      fs.unlinkSync(filepath); // Delete temp file

      if (code === 0) {
        return res.json({ output });
      } else {
        return res.status(400).json({ error });
      }
    });

    python.on('error', (err) => {
      fs.unlinkSync(filepath);
      return res.status(500).json({ error: "Execution error: " + err.message });
    });
  } catch (error) {
    return res.status(500).json({ "error": "something went wrong!" })
  }
});


app.post('/ruby', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }

    // Save the code to a temporary file
    const filename = `sandbox_${Date.now()}.rb`;
    const filepath = path.join('/tmp', filename);
    console.log(filepath, filename)
    fs.writeFileSync(filepath, code);

    // Run Python inside Firejail with strict security
    const python = spawn('firejail', [
      '--quiet',           // No extra logs
      '--private',         // Isolated filesystem
      '--net=none',        // No network access
      '--rlimit-cpu=3',    // CPU limit: 3 seconds
      //'--rlimit-as=500000', // Memory limit: 50MB
      'ruby', filepath
    ]);

    let output = "";
    let error = "";

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', (code) => {
      console.log(output, error)
      fs.unlinkSync(filepath); // Delete temp file

      if (code === 0) {
        return res.json({ output });
      } else {
        return res.status(400).json({ error });
      }
    });

    python.on('error', (err) => {
      fs.unlinkSync(filepath);
      return res.status(500).json({ error: "Execution error: " + err.message });
    });
  } catch (error) {
    return res.status(500).json({ "error": "something went wrong!" })
  }
});

app.post('/bash', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }

    // Save the code to a temporary file
    const filename = `sandbox_${Date.now()}.sh`;
    const filepath = path.join('/tmp', filename);
    console.log(filepath, filename)
    fs.writeFileSync(filepath, code);

    // Run Python inside Firejail with strict security
    const python = spawn('firejail', [
      '--quiet',           // No extra logs
      '--private',         // Isolated filesystem
      '--net=none',        // No network access
      '--rlimit-cpu=5',    // CPU limit: 3 seconds
      //'--rlimit-as=500000', // Memory limit: 50MB
      'bash', filepath
    ]);

    let output = "";
    let error = "";

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', (code) => {
      console.log(output, error)
      fs.unlinkSync(filepath); // Delete temp file

      if (code === 0) {
        return res.json({ output });
      } else {
        return res.status(400).json({ error });
      }
    });

    python.on('error', (err) => {
      fs.unlinkSync(filepath);
      return res.status(500).json({ error: "Execution error: " + err.message });
    });
  } catch (error) {
    return res.status(500).json({ "error": "something went wrong!" })
  }
});


app.post('/perl', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }

    // Save the code to a temporary file
    const filename = `sandbox_${Date.now()}.pl`;
    const filepath = path.join('/tmp', filename);
    console.log(filepath, filename)
    fs.writeFileSync(filepath, code);

    // Run Python inside Firejail with strict security
    const python = spawn('firejail', [
      '--quiet',           // No extra logs
      '--private',         // Isolated filesystem
      '--net=none',        // No network access
      '--rlimit-cpu=3',    // CPU limit: 3 seconds
      //'--rlimit-as=500000', // Memory limit: 50MB
      'perl', filepath
    ]);

    let output = "";
    let error = "";

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', (code) => {
      console.log(output, error)
      fs.unlinkSync(filepath); // Delete temp file

      if (code === 0) {
        return res.json({ output });
      } else {
        return res.status(400).json({ error });
      }
    });

    python.on('error', (err) => {
      fs.unlinkSync(filepath);
      return res.status(500).json({ error: "Execution error: " + err.message });
    });
  } catch (error) {
    return res.status(500).json({ "error": "something went wrong!" })
  }
});


app.post('/rust', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided" });
    }

    const filename = `sandbox_${Date.now()}.rs`;
    const filepath = path.join('/tmp', filename);
    const binarypath = path.join('/tmp', filename.replace(".rs", ""));
    fs.writeFileSync(filepath, code);

    const compile = spawn("rustc", [filepath, "-o", binarypath]);

    let compileError = "";
    compile.stderr.on("data", (data) => {
      compileError += data.toString();
    });


    compile.on("close", (compileCode) => {
      if (compileCode !== 0) {
        return res.status(400).json({ error: compileError })
        fs.unlinkSync(filepath);
      }

      const run = spawn("firejail", [
        "--private",    // Isolated filesystem
        "--net=none",   // No network access
        "--rlimit-cpu=3", // CPU time limit: 2 seconds
        binarypath
      ]);

      let output = "";
      let error = "";

      run.stdout.on("data", (data) => {
        output += data.toString();
      });

      run.stderr.on("data", (data) => {
        error += data.toString();
      });

      run.on("close", (code) => {
        fs.unlinkSync(filepath);
        fs.unlinkSync(binarypath);
        console.log(output, error, code)
        if (code === 0) {
          return res.json({ output })
        } else {
          return res.status(400).json({ error })
        }

      });
    });
  } catch (error) {
    res.status(500).json({ "error": "something went wrong!" })
  }
})

app.listen(5005, () => console.log("Server running on port 5001"));
