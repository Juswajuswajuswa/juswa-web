import { Link, useNavigate } from "react-router-dom";
// import { GiBrain } from "react-icons/gi";
import { FaRegLightbulb } from "react-icons/fa";
// darkmode
// import { FaLightbulb } from "react-icons/fa";
{/* <FaLightbulb /> */}
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess, signUpFailure } from "../../redux/user/userSlice";
import apiRequest from "../lib/apiRequest";
import GoogleAuth from "../components/GoogleAuth";

export default function SignIn() {
  const dispatch = useDispatch()
  const {loading, error} = useSelector((state) => state.user)
  const navigate = useNavigate(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(signInStart())
    try {
      const formData = new FormData(e.target)
      const inputs = Object.fromEntries(formData)
      const {email, password} = inputs

      const res = await apiRequest.post(`/auth/login`, {
        email,
        password
      })

      const data = res.data 
      if (data.success === false) {
        dispatch(signUpFailure(data.message))
      }

      dispatch(signInSuccess(data))
      navigate(`/`)
    } catch (error) {
      dispatch(signInFailure(error.response.data.message))
    }
  }

  return (
    <div className="mt-[150px]">
      <div className="flex flex-col items-center space-y-5">
        <p className="border bg-[#eee] text-slate-700 px-[10px] py-[2px] font-semibold rounded-[3px]">
          Sign In
        </p>
        <h1 className="flex relative flex-wrap text-center text-[2rem] leading-[2.6rem] font-bold md:text-4xl lg:text-5xl">
          SHARE YOUR <br/>
          IDEAS 
          {/* <GiBrain className="absolute bottom-0 right-[70px]" /> */}
          <FaRegLightbulb className="absolute right-[-40px] top-[-5px] rotate-45 lg:right-[-50px]"/>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center flex-col space-y-3 mt-8">
        <input
          className="bg-[#3a3a3a] border py-[15px] px-[40px] text-white rounded-[3px]"
          placeholder="email"
          type="email"
          name="email"
        />
        <input
          className="bg-[#3a3a3a] border py-[15px] px-[40px] text-white rounded-[3px]"
          placeholder="password"
          type="password"
          name="password"
        />
        <div className="flex justify-end w-[300px] space-x-3 p-3 ">
          <button disabled={loading} className="border rounded-[3px] p-3 px-4 hover:bg-white hover:text-black">
            SIGN IN
          </button>
          <GoogleAuth/>
        </div>
        <div className="pt-3">
        {
          error && (
            <span className="text-sm text-red-600">{error}</span>
          )
        }
        </div>
        
      </form>
      <div className="flex items-center space-x-2 mt-10 justify-center">
        <p className="text-sm">No account yet?</p>
        <Link to={`/sign-up`} className="hover:underline">
          <span className="text-sm text-blue-500">Sign up here!</span>
        </Link>
      </div>
    </div>
  );
}
