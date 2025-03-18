import React, { useEffect, useRef, useState } from 'react'
import useWebSocket from "react-use-websocket";
import useStore from '../../store/store'
import Scrollbars from 'react-custom-scrollbars-2'
import HLSPlayer from '../sub/HLSPlayer'

const CHAT_SERVER_URL = "ws://localhost:8082";



function Live({ id, role }) {
  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const username = useStore((state) => state.username)

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(CHAT_SERVER_URL, {
    onOpen: () => console.log("Connected to chat server"),
    onClose: () => console.log("Disconnected from chat server"),
  });



  useEffect(() => {
    if (lastJsonMessage !== null) {
      setMessages((prev) => [...prev, lastJsonMessage]);
    }
  }, [lastJsonMessage]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      sendJsonMessage({ type: "chat", user: username, text: message, room: id });
      setMessage("");
    }
  };

  useEffect(() => {
    if (role !== "teacher") return
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
    if (role !== "teacher") return
    wsRef.current = new WebSocket("ws://localhost:8081?classId=" + id);

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp8",
    });

    recorder.ondataavailable = (event) => {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(event.data)
      }
    };

    recorder.start(1000)
    setMediaRecorder(recorder);
  };

  const stopStreaming = () => {
    mediaRecorder?.stop();
    stream?.getTracks().forEach((track) => track.stop());
    wsRef.current?.close();
  };

  return (
    <div className='flex gap-3 w-full p-3'>
      {
        role === "teacher" ?
          <div className='flex flex-col gap-2  w-[50%] items-start justify-center'>
            <div className='w-[40rem]   h-[25rem] '>
              <video className="rounded-2xl w-full object-cover h-full" ref={videoRef} autoPlay playsInline muted />
            </div>

            <div className='flex gap-3'>
              <button className='rounded-2xl px-3 py-2 bg-secondery' onClick={startStreaming}>Start Streaming</button>
              <button className='rounded-2xl px-3 py-2 bg-secondery' onClick={stopStreaming}>Stop Streaming</button>
            </div>
          </div>
          :
          <HLSPlayer src={"http://locahost:8080/hls/" + id + ".m3u8"} />

      }
      <div className='bg-secondery/50 p-2 rounded-2xl w-[50%] h-[25rem]'>
        <Scrollbars style={{ "zIndex": 0 }} >
          <div className={`bg-secondery   flex gap-1 justify-center items-center w-full rounded-2xl  p-1`}>
            <input onChange={(e) => setMessage(e.target.value)}
              name="announce" placeholder='Type ..' className='w-full bg-transparent/50   rounded-2xl p-1 px-2 focus:outline-none ' />
            <button onClick={sendMessage} className=''>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className={`bi bi-send rounded-md  cursor-pointer  "text-tersiory/70 hover:text-tersiory"  duration-300 `} viewBox="0 0 16 16">
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
              </svg>
            </button>
          </div>

          {messages.length === 0 && <div className='w-full h-full flex justify-center items-center'> <h1 className='font-semibold text-2xl opacity-60 text-center'>No Chat</h1></div>}
          {
            messages.map((msg) => (
              <div className=' flex my-2 flex-col gap-1 w-full rounded-2xl bg-secondery/80  p-4'>
                <h1 className='font-semibold flex justify-between' >{msg.user} </h1>
                <p className='w-full break-words overflow-wrap'>{msg.message}</p>
              </div>
            ))
          }
        </Scrollbars>
      </div>

    </div >

  )
}

export default Live
