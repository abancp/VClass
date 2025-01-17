import { create } from 'zustand'
import axios from 'axios'

const useStore = create((set) => ({
  isLogin: false,
  setIsLogin: (isLogin) => set({ isLogin }),
  username: null,
  setUsername: (username) => set({ username }),
  fetchUserdata: () => {
      axios.get("http://localhost:5000/get-userdata", { withCredentials: true }).then(({ data }) => {
        console.log(data)
        if (data.success) {
          set({username:data.username,isLogin:true}) 
        }
      })
    }
}))


export default useStore
