import { create } from 'zustand'
import axios from 'axios'
import { SERVER_URL } from '../config/SERVER_URL'

const useStore = create((set) => ({
  isLogin: false,
  setIsLogin: (isLogin) => set({ isLogin }),
  username: null,
  setUsername: (username) => set({ username }),
  profileUrl: null,
  setProfileUrl: (profileUrl) => set({ profileUrl }),
  fetchUserdata: () => {
    axios.get(SERVER_URL + "/get-userdata", { withCredentials: true }).then(({ data }) => {
      console.log(data)
      if (data.success) {
        set({ username: data.username, isLogin: true, profileUrl: data.profile_url })
      }
    })
  }
}))


export default useStore
