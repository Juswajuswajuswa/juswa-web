import { Link } from "react-router-dom";
// import apiRequest from "../lib/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import {
  signUpFailure,
  signUpStart,
  signUpSuccess,
} from "../../redux/user/userSlice";
import apiRequest from "../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "../components/GoogleAuth";


export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate(null)
  const {loading, error} = useSelector((state) => state.user)


  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signUpStart());

    try {
      const formData = new FormData(e.target);
      const inputs = Object.fromEntries(formData);
      console.log(inputs);
      const { email, username, password } = inputs;
      const res = await apiRequest.post(`/auth/register`, {
        email,
        username,
        password,
      });

      const data = res.data;
      if (data.success === false) {
        console.log(data.message)
        dispatch(signUpFailure(data.message));
      }

      dispatch(signUpSuccess(data));
      navigate(`/`)
    } catch (error) {
      console.log(error);
      dispatch(signUpFailure(error.response.data.message))
    }
  };

  return (
    <div className="mt-[150px]">
      <div className="flex flex-col items-center space-y-5">
        <p className="border bg-[#eee] text-slate-700 px-[10px] py-[2px] font-semibold rounded-[3px]">
          Sign Up
        </p>
        <h1 className="text-center text-[2rem] leading-[2.6rem] font-bold md:text-4xl lg:text-5xl">
        INSPIRE OTHERS WITH <br/> YOUR WORDS
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center flex-col space-y-3 mt-8"
      >
        <input
          className="bg-[#3a3a3a] border py-[15px] px-[40px] text-white rounded-[3px]"
          placeholder="email"
          type="email"
          name="email"
        />
        <input
          className="bg-[#3a3a3a] border py-[15px] px-[40px] text-white rounded-[3px]"
          placeholder="username"
          type="username"
          name="username"
        />
        <input
          className="bg-[#3a3a3a] border py-[15px] px-[40px] text-white rounded-[3px]"
          placeholder="password"
          type="password"
          name="password"
        />
        <div className="flex justify-end w-[300px] space-x-3 p-3 ">
          <button className="border rounded-[3px] p-3 px-4 hover:bg-[#eee] hover:text-black">
            SIGN UP
          </button>
          <GoogleAuth/>
        </div>

        <div className="py-3">

        {
          error && (
            <span className="text-sm text-red-600">{error}</span>
          )
        }

        </div>
        

      </form>
      <div className="flex items-center space-x-2 mt-10 justify-center">
        <p className="text-sm">Already have an account?</p>
        <Link to={`/sign-in`} className="hover:underline">
          <span className=" text-blue-500">Sign in here!</span>
        </Link>
      </div>
    </div>
  );
}
