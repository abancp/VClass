import React from 'react'
import Notice from '../sub/Notice'

function NoticeBoard({notices}) {
  return (
    <div className='border font-paint  rounded-md bg-secondery/30 border-tersiory/50 w-full h-[20rem] p-3'>
      <h3 className='t text-center  text-lg font-[400]'>Notice Board</h3>
     {
        notices.map((notice)=>(<Notice  {...notice}/>))
      } 
    </div>
  )
}

export default NoticeBoard

