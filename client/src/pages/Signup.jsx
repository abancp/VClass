import axios from "axios"
import { useNavigate, Link, useSearchParams } from "react-router"
import { SERVER_URL } from "../config/SERVER_URL"
import useStore from "../store/store"
import { toast } from 'sonner'
import Header from "../components/main/Header"

function Signup() {
  const state = useStore((state) => state)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (e.target.password.value !== e.target.confirm_password.value) {
      return toast.error("Password not matching")
    }
    axios
      .post(SERVER_URL + "/register", {
        username: e.target.username.value,
        password: e.target.password.value,
        email: e.target.email.value
      }, { withCredentials: true })
      .then((res) => {
        console.log(res.data)
        state.setUsername(e.target.username.value)
        state.setIsLogin(true)
        state.fetchUserdata()
        if (searchParams.get('to') === "join") {
          navigate("/join?name=" + searchParams.get('name') + "&key=" + searchParams.get('key'))
        } else {
          toast.success(res.data.message || "Something went wrong!")  
          navigate("/")
        }
      })
      .catch(()=>{
        toast.error("Something went wrong!")
      })
  }

  return <>
    <div className="min-h-screen text-light justify-center bg-dark flex items-center w-100 ">
      <Header />
      <div className=" bg-secondery w-[50rem] h-[23rem] justify-between items-center flex rounded-2xl">
        <div className="w-1/2 gap-3 h-full flex flex-col justify-center items-center">
          <div className="flex flex-col text-center">
            <h1 className="text-3xl font-bold mb-4 text-light">signup</h1>
            <p>create an account in vclass</p>
            <p>already have an account <Link className="text-blue-600 underline" to={searchParams.get('to') ? "/login?to=join&name=" + searchParams.get('name') + '&key=' + searchParams.get('key') : "/login"} >login here</Link></p>
          </div>
          <h2 className="font-semibold text-xl ">or continue with</h2>
          <div className="flex flex-col gap-1 w-full items-center">
            <div className=" bg-orange-600 w-[70%] h-[2rem] rounded-full font-semibold text-lg text-center">google</div>
            <div className="bg-blue-600 w-[70%] h-[2rem] rounded-full font-semibold text-lg text-center">facebook</div>
          </div>
        </div>
        <div className="h-[90%] opacity-90 border-l border-tersiory/50"></div>
        <div className="w-1/2 h-ull flex flex-col justify-center gap-3 items-center">
          <form method="post" onSubmit={handleSubmit} className="w-full h-full flex flex-col justify-center gap-3 items-center text-dark">
            <h1 className="font-bold text-3xl text-light mb-4 ">Create Account</h1>
            <input placeholder="full name" name="username" className="border-b text-light border-secondery focus:outline-none border-tersiory/60 focus:border-b-2 border-b focus:border-tersiory bg-transparent w-[70%] p-1" />
            <input placeholder="email" name="email" type="email" className="border-b text-light border-secondery focus:outline-none border-tersiory/60 focus:border-b-2 border-b focus:border-tersiory bg-transparent w-[70%] p-1" />
            <input placeholder="password" name="password" type="password" className="border-b text-light border-secondery focus:outline-none border-tersiory/60 focus:border-b-2 border-b focus:border-tersiory bg-transparent w-[70%] p-1" />
            <input placeholder="confirm password" name="confirm_password" type="password" className="border-b text-light border-secondery focus:outline-none border-tersiory/60 focus:border-b-2 border-b focus:border-tersiory bg-transparent w-[70%] p-1" />
            <input type="submit" value="submit" className=" border-b border-secondery focus:outline-none   bg-tersiory rounded-md w-[70%] p-1" />
          </form>

        </div>
      </div>
    </div>
  </>
}

export default Signup 
