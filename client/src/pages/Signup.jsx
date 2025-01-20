import axios from "axios"
import { useNavigate ,Link} from "react-router"
import { SERVER_URL } from "../config/SERVER_URL"
import useStore from "../store/store"

function Signup() {
  const state = useStore((state)=>state)

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (e.target.password.value === e.target.confirm_password.value) {
      console.log("Password not matching!")
    }
    axios
      .post(SERVER_URL+"/register", {
        username: e.target.username.value,
        password: e.target.password.value,
        email: e.target.email.value
      }, { withCredentials: true })
      .then((res) => {
        console.log(res.data)
        state.setUsername(e.target.username.value)
        state.setIsLogin(true)
        state.fetchUserdata()
        navigate('/')
      })

  }

  return <>
    <div className="min-h-screen text-light justify-center bg-dark flex items-center w-100 ">
      <div className="border bg-secondery border-black w-[50rem] h-[23rem] justify-between items-center flex rounded-md">
        <div className="w-1/2 gap-3 h-full flex flex-col justify-center items-center">
          <div className="flex flex-col text-center">
            <h1 className="text-3xl font-bold mb-4 text-light">signup</h1>
            <p>create an account in vclass</p>
            <p>already have an account <Link className="text-blue-600 underline" to="/login" >login here</Link></p>
          </div>
          <h2 className="font-semibold text-xl ">or continue with</h2>
          <div className="flex flex-col gap-1 w-full items-center">
            <div className=" bg-orange-600 w-[70%] h-[2rem] rounded-full font-semibold text-lg text-center">google</div>
            <div className="bg-blue-600 w-[70%] h-[2rem] rounded-full font-semibold text-lg text-center">facebook</div>
          </div>
        </div>
        <div className="h-[90%] opacity-90 border-l border-black"></div>
        <div className="w-1/2 h-ull flex flex-col justify-center gap-3 items-center">
          <form method="post"  onSubmit={handleSubmit} className="w-full h-full flex flex-col justify-center gap-3 items-center text-dark">
            <h1 className="font-bold text-3xl text-light mb-4 ">Create Account</h1>
            <input placeholder="full name" name="username" className="w-[70%] rounded-full h-[2rem] px-3 font-semibold text-lg border border-black" />
            <input placeholder="email" name="email" type="email" className="w-[70%] rounded-full h-[2rem] px-3 font-semibold text-lg border border-black" />
            <input placeholder="password" name="password" type="password" className="w-[70%] rounded-full h-[2rem] px-3 font-semibold text-lg border border-black" />
            <input placeholder="confirm password" name="confirm_password" type="password" className="w-[70%] rounded-full h-[2rem] px-3 font-semibold text-lg border border-black" />
            <input type="submit" value="submit" className="w-[70%] hover:text-white hover:bg-tersiory duration-300 rounded-full h-[2rem] px-3 font-semibold cursor-pointer text-lg border border-black" />
          </form>

        </div>
      </div>
    </div>
  </>
}

export default Signup 
