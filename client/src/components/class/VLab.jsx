import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { rust } from "@codemirror/lang-rust";
import { go } from "@codemirror/lang-go";
import axios from "axios";
import Scrollbars from "react-custom-scrollbars-2";

const JavaScriptEditor = () => {
  const [code, setCode] = useState(`console.log("Hello, JavaScript!");`);
  const [output, setOutput] = useState("");
  const [lang, setLang] = useState("javascript")
  const [running, setRunning] = useState(false)
  const [viewFlex, setViewFlex] = useState(true)

  const exts = {
    javascript: javascript(),
    python: python(),
    c: cpp(),
    cpp: cpp(),
    java: java(),
    go: go(),
    rust: rust(),
  }


  const basics = {
    javascript: 'console.log("Hello, World!");',
    python: 'print("Hello, World!")',
    c: '#include <stdio.h>\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
    cpp: '#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    go: 'package main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
    rust: 'fn main() {\n    println!("Hello, World!");\n}',
    ruby: 'puts "Hello, World!"',
    perl: '#!/usr/bin/perl\nuse strict;\nuse warnings;\nprint "Hello, World!\\n";',
    bash: '#!/bin/bash\necho "Hello, World!"',
  }

  useEffect(() => {
    setCode(basics[lang])
  }, [lang])

  const run = () => {
    try {
      setRunning(true)
      console.log("True")
      setOutput("")
      let logs = [];
      if (lang === "javascript") {
        const originalConsoleLog = console.log;
        console.log = (...args) => logs.push(args.join(" "));
        new Function(code)();
        console.log = originalConsoleLog;
        setOutput(logs.join("\n") || "No output.");
        setRunning(false)
      } else if (lang === "python") {
        axios.post('http://localhost:5005/python', { code })
          .then(({ data }) => {
            setOutput(data.output)
            setRunning(false)
          })
          .catch(({ response }) => {
            setOutput(response?.data?.error)
            setRunning(false)
          })

      }
      else if (lang === "bash") {
        axios.post('http://localhost:5005/bash', { code })
          .then(({ data }) => {
            setOutput(data.output)
            setRunning(false)
          })
          .catch(({ response }) => {
            setOutput(response?.data?.error)
            setRunning(false)

          })
      }
      else if (lang === "c") {
        axios.post('http://localhost:5005/c', { code })
          .then(({ data }) => {
            setOutput(data.output)
            setRunning(false)

          })
          .catch(({ response }) => {
            setOutput(response?.data?.error)
            setRunning(false)

          })
      } else if (lang === "cpp") {
        axios.post('http://localhost:5005/cpp', { code })
          .then(({ data }) => {
            setOutput(data.output)
            setRunning(false)

          })
          .catch(({ response }) => {
            setOutput(response?.data?.error)
            setRunning(false)

          })
      } else if (lang === "go") {
        axios.post('http://localhost:5005/go', { code })
          .then(({ data }) => {
            setOutput(data.output)
            setRunning(false)

          })
          .catch(({ response }) => {
            setOutput(response?.data?.error)
            setRunning(false)

          })
      } else if (lang === "java") {
        axios.post('http://localhost:5005/java', { code })
          .then(({ data }) => {
            setOutput(data.output)
            setRunning(false)

          })
          .catch(({ response }) => {
            setOutput(response?.data?.error)
            setRunning(false)
          })
      } else if (lang === "ruby") {
        axios.post('http://localhost:5005/ruby', { code })
          .then(({ data }) => {
            setOutput(data.output)
            setRunning(false)

          })
          .catch(({ response }) => {
            setOutput(response?.data?.error)
            setRunning(false)
          })
      }
      else if (lang === "perl") {

        axios.post('http://localhost:5005/perl', { code })
          .then(({ data }) => {
            setOutput(data.output)
            setRunning(false)
          })
          .catch(({ response }) => {
            setOutput(response?.data?.error)
            setRunning(false)
          })
      }
      else if (lang === "rust") {
        axios.post('http://localhost:5005/rust', { code })
          .then(({ data }) => {
            setOutput(data.output)
            setRunning(false)
          })
          .catch(({ response }) => {
            setOutput(response?.data?.error)
            setRunning(false)
          })
      }

    } catch (error) {
      setOutput("Error: " + error.message);
      setRunning(false)
    }
  };

  return (
    <div className="p-2 pt-0 ">
      <div className="flex justify-between px-2 py-1 items-center">
        <select className="bg-dark w-fit bg-secondery/30 rounded-md  text-tersiory focus:outline-none" onChange={(e) => { setLang(e.target.value) }}>
          <option className="text-dark" value={"javascript"} defaultChecked>javascript</option>
          <option className="text-dark" value={"python"}>python</option>
          <option className="text-dark" value={"c"}> c </option>
          <option className="text-dark" value={"cpp"}> c++ </option>
          <option className="text-dark" value={"go"}> go </option>
          <option className="text-dark" value={"java"}> java </option>
          <option className="text-dark" value={"ruby"}> ruby </option>
          <option className="text-dark" value={"perl"}> perl </option>
          <option className="text-dark" value={"rust"}> rust </option>
          <option className="text-dark" value={"bash"}> bash </option>
        </select>

        <div className="flex gap-4 justify-between w-[5rem] ">
          <svg onClick={() => setViewFlex((p) => !p)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className={`bi bi-layout-sidebar-reverse transition-all duration-300 ease-in-out text-tersiory cursor-pointer ${viewFlex && "rotate-90"}`} viewBox="0 0 16 16">
            <path d="M8 15V1h6a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1zm6 1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />

          </svg>
          {
            running ?
              <div class="w-[1.4rem] h-[1.4rem] border-2 border-tersiory border-t-transparent rounded-full animate-spin"></div>
              :
              <svg onClick={run} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pause-circle text-tersiory hover:text-tersiory cursor-pointer" viewBox="0 0 16 16">

                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445" />
              </svg>
          }
        </div>

      </div>
      <div className={`flex w-full h-full gap-2 ${viewFlex || "flex-col"} `}>
        <CodeMirror
          value={code}
          className="text-[15px] duration-200 transition-all"
          extensions={[exts[lang] || python()]}
          theme="dark"
          height={viewFlex ? "30rem" : "20rem"}
          style={{ "width": viewFlex ? "70%" : "100%" }}
          onChange={(newCode) => setCode(newCode)}
        />
        <div className={`bg-secondery transition-all duration-200  p-2 ${viewFlex ? "h-[30rem] w-[30%]" : "h-[10rem] w-[full]"}`}>
          <Scrollbars>
            <pre>{output}</pre>
          </Scrollbars>
        </div>
      </div>
    </div>
  );
};

export default JavaScriptEditor;
