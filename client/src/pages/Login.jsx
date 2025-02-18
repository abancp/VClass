import axios from "axios"
import { useNavigate, Link, useSearchParams } from "react-router"
import { toast } from "sonner"
import Header from "../components/main/Header"
import { SERVER_URL } from "../config/SERVER_URL"
import useStore from "../store/store"

function Login() {

  const state = useStore((state) => state)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleSubmit = (e) => {
    e.preventDefault()

    axios.post(SERVER_URL + "/login",
      {
        email: e.target.email.value,
        password: e.target.password.value
      },
      {
        withCredentials: true
      }
    ).then((res) => {
      console.log(res.data)
      state.setUsername(res.data.username)
      state.setIsLogin(true)
      state.fetchUserdata()
      console.log(decodeURIComponent(searchParams.get("to")))
      if (searchParams.get('to') === "join") {
        navigate("/join?name=" + searchParams.get('name') + "&key=" + searchParams.get('key'))
      } else {
        toast.success(res.data.message)
        navigate("/")
      }
    })
      .catch(() => {
        toast.error("something went wrong!")
      })
  }

  return <>
    <div className="min-h-screen pt-header justify-center text-light bg-dark flex items-center w-100 ">
      <Header />
      <div className="bg-secondery w-[50rem] h-[23rem] justify-between items-center flex rounded-2xl">
        <div className="w-1/2 gap-3 h-full flex flex-col justify-center items-center">
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-3xl font-bold ">Login</h1>
            <p>Login VClass</p>
            <p>dont have an account <Link className="underline text-blue-600" to={searchParams.get('to') ? "/signup?to=join&name=" + searchParams.get('name') + '&key=' + searchParams.get('key') : "/signup"} >signup here</Link></p>

          </div>
          <h2 className="font-semibold text-xl ">OR Continue with</h2>
          <div className="flex flex-col gap-1 w-full items-center">
            <div className=" bg-orange-600 w-[70%] h-[2rem] rounded-full font-semibold text-lg text-center">Google</div>
            <div className=" bg-blue-600 w-[70%] h-[2rem] rounded-full font-semibold text-lg text-center">Facebook</div>
          </div>
        </div>
        <div className="h-[90%] opacity-90 border-l border-tersiory/50"></div>
        <div className="w-1/2 h-ull flex flex-col justify-center gap-3 items-center">
          <form onSubmit=
            {handleSubmit} method="post" className="text-dark w-full h-full flex flex-col justify-center gap-3 items-center">
            <input
              name="email"
              placeholder='email'
              className=' border-b text-light border-secondery focus:outline-none border-tersiory/60 focus:border-b-2 border-b focus:border-tersiory bg-transparent w-[70%] p-1'
              type="email" />
            <input
              name="password"
              placeholder='password'
              className=' border-b text-light cursor-pointer border-secondery focus:outline-none border-tersiory/60 focus:border-b-2 border-b focus:border-tersiory bg-transparent w-[70%] p-1'
              type="password" />

            <input
              name="submit"
              placeholder='submit'
              className=' border-b border-secondery focus:outline-none   bg-tersiory rounded-md w-[70%] p-1'
              type="submit" />
          </form>
        </div>
      </div>
    </div>
  </>
}

export default Login
