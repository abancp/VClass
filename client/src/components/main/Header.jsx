import React, { useEffect, useState, useRef } from 'react'
import { Link } from "react-router"
import useStore from '../../store/store'

function Header({ sub, handleMenuClick, forWhat }) {

  const isLogin = useStore((state) => state.isLogin)
  const username = useStore((state) => state.username)
  const fetchUserdata = useStore((state) => state.fetchUserdata)

  useEffect(() => {
    console.log(isLogin)
    if (!isLogin) {
      fetchUserdata()
    }
  }, [isLogin, fetchUserdata])

  return (
    <header className=' h-[3.5rem] w-full border-b border-dark top-0 left-0 fixed z-[100] text-light px-4 py-2 justify-between items-center gap bg-secondery gap-3 flex'>
      <div className='flex gap-3 '>
        {forWhat === "class" &&
          <svg onClick={handleMenuClick} xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className=" cursor-pointer bi bi-list" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
          </svg>
        }
        {forWhat ==="popup"&&
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="text-tersiory bi bi-x-lg" viewBox="0 0 16 16">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg>
        }
        <h1 className='text-xl font-bold'><Link to="/" >VClass</Link> {sub && "/"} {sub}</h1>
      </div>
      <div className="flex gap-3">
        {(forWhat === "home" && isLogin) && <Link to="/create/class">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="hover:opacity-80 duration-300 text-tersiory cursor-pointer bi bi-plus-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
        </Link>}
        {
          isLogin ?
            <h1 className='text-xl font-bold'>{username}</h1>
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
