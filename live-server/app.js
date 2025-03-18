const WebSocket = require("ws");
const { spawn } = require("child_process");

const wss = new WebSocket.Server({ port: 8081 });

wss.on("connection", (ws, req) => {
  console.log("Client connected for streaming");

  const urlParams = new URLSearchParams(req.url.split("?")[1]);
  const classId = urlParams.get("classId");

  const ffmpeg = spawn("ffmpeg", [
    "-i", "pipe:0",  // Read from WebSocket
    "-c:v", "libx264",
    "-preset", "ultrafast",  // Reduce processing time
    "-tune", "zerolatency",  // Optimize for low latency
    "-b:v", "1500k",  // Control bitrate
    "-maxrate", "1500k",
    "-bufsize", "3000k",
    "-g", "30",  // Lower GOP size for less delay
    "-c:a", "aac",
    "-ar", "44100",
    "-b:a", "128k",
    "-f", "flv",
    "rtmp://localhost/live/" + classId
  ]);


  ws.on("message", (data) => {
    ffmpeg.stdin.write(data);
  });

  ws.on("close", () => {
    ffmpeg.stdin.end();
    console.log("Client disconnected");
  });
});

console.log("WebSocket Server running on ws://localhost:8081");

