import axios from "axios"
import { useNavigate, Link, useSearchParams } from "react-router"
import { SERVER_URL } from "../config/SERVER_URL"
import useStore from "../store/store"
import { toast } from 'sonner'
import Header from "../components/main/Header"
import { signInWithGoogle } from "../config/firebase"

function Signup() {
  const state = useStore((state) => state)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    if (!e.google) {
      e.preventDefault()
    }
    let userdata = {}
    if (e.google) {
      userdata = e
    } else {
      if (e.target.password.value !== e.target.confirm_password.value) {
        return toast.error("Password not matching")
      }
      userdata = {
        username: e.target.username.value,
        password: e.target.password.value,
        email: e.target.email.value,
      }
    }
    axios
      .post(SERVER_URL + "/register", userdata, { withCredentials: true })
      .then((res) => {
        console.log(res.data)
        if (e.google) {
          state.setUsername(e.username)
        } else {
          state.setUsername(e.target.username.value)
        }
        state.setIsLogin(true)
        state.fetchUserdata()
        if (searchParams.get('to') === "join") {
          navigate("/join?name=" + searchParams.get('name') + "&key=" + searchParams.get('key'))
        } else {
          toast.success(res.data.message)
          navigate("/")
        }
      })
      .catch(({ response }) => {
        toast.error(response.data?.message || "Something went wrong!")
      })
  }

  const handleSignWithGoogle = () => {
    signInWithGoogle()
      .then((user) => { handleSubmit({ google: true, email: user.email, username: user.displayName , profile_url: user.photoURL }) })
  }

  return <>
    <div className="min-h-screen pt-header text-light justify-center bg-dark flex items-center w-100 ">
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
            <div onClick={handleSignWithGoogle} className=" bg-tersiory w-[70%] h-[2rem] rounded-md font-semibold text-lg flex justify-center gap-2 text-dark items-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-google text-yellow-300" viewBox="0 0 16 16">
                <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
              </svg>
              <h1> Google</h1>
            </div>
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
