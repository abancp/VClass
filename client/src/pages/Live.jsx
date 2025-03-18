import React, { useEffect, useRef, useState } from "react";

const Streamer = () => {
  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });

      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    };

    startCamera();
  }, []);

  const startStreaming = async () => {
    wsRef.current = new WebSocket("ws://localhost:8081"); // Connect to Node.js WebSocket

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp8",
    });

    recorder.ondataavailable = (event) => {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(event.data); // Send video chunks to Node.js
      }
    };

    recorder.start(1000); // Send data every second
    setMediaRecorder(recorder);
  };

  const stopStreaming = () => {
    mediaRecorder?.stop();
    stream?.getTracks().forEach((track) => track.stop());
    wsRef.current?.close();
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted />
      <button onClick={startStreaming}>Start Streaming</button>
      <button onClick={stopStreaming}>Stop Streaming</button>
    </div>
  );
};

export default Streamer;

