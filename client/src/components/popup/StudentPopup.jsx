import React from 'react'

function StudentPopup({ handleClose, username, user }) {
  return (
    <div onClick={handleClose} className='bg-dark/70  w-screen backdrop-blur-sm  h-screen fixed top-0 left-0 z-[10000] flex justify-center items-center'>
      <div onClick={(e) => e.stopPropagation()} className='bg-secondery rounded-md w-[30rem] h-[20rem]'>
        <h1 className='font-semibold text-2xl m-3'>{username}</h1>
        <div className='h-[15rem] overflow-y-scroll'>
          <table className='m-[3rem]'>
            <tr className='border-b border-tersiory '>
              <th className='p-2'>Work</th>
              <th className='p-2'>Mark</th>
            </tr>
            {
              user?.map((workData) => (
                <tr className='border-b border-tersiory '>
                  <td className='p-2'>{workData.work_title}</td>
                  <td className='p-2'>{workData.mark}</td>
                </tr>
              ))
            }
          </table>
        </div>
      </div>

    </div >
  )
}

export default StudentPopup
