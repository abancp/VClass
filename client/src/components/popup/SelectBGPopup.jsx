import React from 'react'


function SelectBGPopup({ handleClose, setSelected }) {

  const images = ['back.png', 'back1.png', 'back2.png', 'back3.png', 'back4.png', 'back5.png', 'back6.png', 'back7.png', 'back8.png', 'back9.png','back10.png','back11.png']

  return (
    <div onClick={() => handleClose()} className='bg-dark/80 w-screen backdrop-blur-sm  h-screen fixed top-0 left-0 z-[10000] flex justify-center items-center'>
      <div className='grid overflow-scroll gap-8 p-10 justify-items-start grid-cols-1 pb-40 md:grid-cols-2 lg:grid-cols-3  w-full h-full'>

        {
          images.map((url) => (<img alt={url} onClick={(e) => { e.stopPropagation(); setSelected(url); handleClose() }} className='border cursor-pointer border-tersiory/50 rounded-md w-[23rem] h-[10rem] object-cover' src={"/" + url} />))

        }

      </div>
    </div>
  )
}

export default SelectBGPopup
