import React, { useEffect, useState } from 'react'
import { Link } from "react-router"
import useStore from '../../store/store'
import UserProfilePopup from '../popup/UserProfilePopup'

function Header({ sub, handleMenuClick, handleClose, tab, sub1, forWhat, setTab }) {

  const [showUserPopup, setShowUserPopup] = useState(false)

  const isLogin = useStore((state) => state.isLogin)
  const username = useStore((state) => state.username)
  const profileUrl = useStore((state) => state.profileUrl)
  console.log(profileUrl)
  const fetchUserdata = useStore((state) => state.fetchUserdata)

  useEffect(() => {
    console.log(isLogin)
    if (!isLogin) {
      fetchUserdata()
    }
  }, [isLogin, fetchUserdata])

  return (
    <header className='backdrop-blur-sm  bg-center bg-no-repeat h-[3.5rem] w-full  top-0 left-0 fixed z-[100] text-light  px-4 py-2 justify-between items-center gap bg-secondery/40 gap-3 flex'>
      {showUserPopup && <UserProfilePopup handleClose={() => setShowUserPopup(false)} username={username} />}
      <div className='flex gap-3 w-[33.3%]'>
        {forWhat === "class" &&
          <svg onClick={handleMenuClick} xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className=" cursor-pointer bi bi-list" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
          </svg>
        }
        {forWhat === "popup" &&
          <svg onClick={handleClose} xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="hover:rotate-[180deg] duration-300 text-tersiory cursor-pointer bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
          </svg>
        }
        <h1 className='text-xl font-bold'><Link to="/" >VClass</Link> {sub && "/"} {sub} {sub1 && "/"} {sub1}</h1>
      </div>
      {forWhat === "home" &&
        <div className='flex gap-2 justify-center text-[17px] font-semibold w-[33.3%]'>
          <div onClick={() => setTab("personal")} className={`p-1 hover:bg-secondery ${tab === "personal" && "bg-tersiory hover:bg-tersiory"} rounded-md px-2 cursor-pointer `}>Personal</div>
          <div onClick={() => setTab("joined")} className={`p-1 hover:bg-secondery ${tab === "joined" && "bg-tersiory hover:bg-tersiory"} rounded-md px-2 cursor-pointer `}>Public</div>
          <div onClick={() => setTab("public")} className={`p-1 hover:bg-secondery ${tab === "public" && "bg-tersiory hover:bg-tersiory"} rounded-md px-2 cursor-pointer `}>Discover</div>
        </div>
      }
      <div className="flex gap-3 w-[33.4%] h-full items-center justify-end">
        {(forWhat === "home" && isLogin) && <Link to="/create/class">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="hover:opacity-80 duration-300 text-tersiory cursor-pointer bi bi-plus-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
        </Link>}
        {
          isLogin && profileUrl && <img className='h-[1.7rem] w-[1.7rem] object-cover rounded-2xl' referrerPolicy='no-referrer' src={profileUrl} alt="img" />
        }
        {
          isLogin ?
            <div className='flex gap-2 items-center justify-center'>

              <h1 onClick={() => { setShowUserPopup(true) }} className='text-xl cursor-pointer hover:text-tersiory duration-300 font-bold'>{username}</h1>
            </div>
            :
            <div className='flex gap-3'>
              <Link className='px-2 py-1 text-md hover:text-white duration-300' to="/login">Login</Link>
              <Link className=' px-2 py-1 bg-dark hover:text-white duration-300 rounded-md' to="/signup" >Sign up</Link>
            </div>
        }
      </div>
    </header>
  )

}

export default Header
