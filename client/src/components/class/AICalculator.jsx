import React, { useRef, useState } from 'react';
import CanvasDraw from "react-canvas-draw";
import axios from 'axios';

const Canvas = () => {
  const [drawingTimeOut, setDrawingTimeOut] = useState(null)
  const [color, setColor] = useState('black')
  const [lastXY, setLastXY] = useState({ x: 0, y: 0 })
  const [rad, setRad] = useState(2)

  const canvas = useRef(null)

  const drawText = (text, x, y, color = 'black', fontSize = '20px', fontFamily = 'Arial') => {
    const canvas1 = canvas.current.canvasContainer.children[1]; // Access the second canvas (where drawing occurs)
    const context = canvas1.getContext('2d');

    // Set text properties
    context.font = `${fontSize} ${fontFamily}`;
    context.fillStyle = color;
    context.fillText(text, x, y);
  };
  const handleClear = () => {
    canvas?.current?.eraseAll()
  }
  const handleUndo = () => {
    canvas.current.undo()
  }


  const handleDrawEnd = async () => {
    let drawingData = await canvas.current.getSaveData()
    drawingData = JSON.parse(drawingData)
    const lastStroke = drawingData.lines[drawingData.lines.length - 1];
    if (!lastStroke) return
    const lastPoint = lastStroke?.points[lastStroke?.points.length - 1];
    setLastXY(lastPoint)
    if (drawingTimeOut) {
      clearTimeout(drawingTimeOut)
    }
    const newTimeout = setTimeout(() => {
      calculate()

    }, 500)
    setDrawingTimeOut(newTimeout)
  }

  const calculate = async () => {
    const base64Image = await canvas.current.getDataURL('png', false, '#FFFFFF')
    const byteString = atob(base64Image.split(',')[1])
    const mimeString = base64Image.split(",")[0].split(':')[1].split(";")[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: mimeString })
    const formData = new FormData()
    formData.append('image', blob, 'canvas-image.png')

    axios.post('http://localhost:5003/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {
      if (res.status == 200) {
        if (res.data.answer) {
          let result = Number(String(res.data.answer).split('.')[1]) == 0 ? String(res.data.answer).split('.')[0] : res.data.answer
          drawText(String(result), lastXY.x + 50, lastXY.y + 30, color, '80px')
        } else {
          console.log(res.data)
        }
      }
    })
      .catch((e) => {
        console.error(e)
      })

  }


  return (
    <div className='w-full flex flex-col gap-2 items-center justify-end  p-3 h-[calc(100vh-3.5rem)]'>
      <div className='pl-[1rem] flex justify-around items-center gap-[1rem]'>
        <button onClick={handleClear} >clear</button>


        <button onClick={handleUndo} >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-          counterclockwise" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z" />
            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
          </svg>
        </button>

        <div></div>
        <div></div>
        <div className='flex gap-4'>

          <button className='h-[1.5rem] rounded-2xl border border-tersiory/50 w-[3rem] bg-black' onClick={() => { setColor("black") }}>

          </button>
          <button className='h-[1.5rem] rounded-2xl border border-tersiory/50 w-[3rem] bg-white' onClick={() => { setColor("white") }}>

          </button>

          <button className='h-[1.5rem] rounded-2xl border border-tersiory/50 w-[3rem] bg-red-500' onClick={() => { setColor("red") }}>

          </button>
          <button className='h-[1.5rem] rounded-2xl border border-tersiory/50 w-[3rem] bg-blue-500' onClick={() => { setColor("blue") }}>

          </button>
          <button className='h-[1.5rem] rounded-2xl border border-tersiory/50 w-[3rem] bg-green-500' onClick={() => { setColor("green") }}>

          </button>
          <button className='h-[1.5rem] rounded-2xl border border-tersiory/50 w-[3rem] bg-purple-500' onClick={() => { setColor("purple") }}>

          </button>
        </div>
        <input min={2} type="range" onChange={(e) => setRad(e.target.value)} />
      </div>
      <CanvasDraw
        ref={canvas}
        hideGrid={true}
        style={{
          width: '100%',
          height: '100vh',
          borderRadius: '1rem',
          border:"1px solid #1192B8"
        }}
        brushRadius={rad}
        brushColor={color}
        lazyRadius={10}
        onChange={handleDrawEnd}
      />
    </div>
  );
};

export default Canvas
