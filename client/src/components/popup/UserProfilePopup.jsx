import React from 'react'

function UserProfilePopup({ handleClose, username }) {
  const handleClick = () => {
    logout()
  }
  const logout = () => {
    window.document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.document.location.reload()
  }
  return (
    <div onClick={handleClose} className='bg-dark/70  w-screen backdrop-blur-sm  h-screen fixed top-0 left-0 z-[10000] flex justify-center items-center'>
      <div onClick={(e) => e.stopPropagation()} className='bg-secondery rounded-md w-[30rem] h-fit p-4'>
        <h1 className='font-semibold text-2xl '>{username}</h1>
        <div className='flex justify-end w-full'>
          <button onClick={handleClick} className='rounded-md px-2 py-1 bg-tersiory'>Logout</button>
        </div>
      </div>

    </div >

  )
}

export default UserProfilePopup
