// import important firebase something
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../firebase/firebase.js";
import { FcGoogle } from "react-icons/fc";
import apiRequest from '../lib/apiRequest.js'
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../redux/user/userSlice.js";

export default function GoogleAuth() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await apiRequest.post(`/auth/google`,{
        email: result.user.email,
        username: result.user.displayName,
        profilePhoto: result.user.photoURL
      })

      const data = res.data 
      dispatch(signInSuccess(data))
      navigate(`/`)

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="border p-3 px-5 hover:bg-white hover:text-slate-700 rounded-[3px]"
    >
      <FcGoogle className="size-5" />
    </button>
  );
}
