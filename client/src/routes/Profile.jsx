import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../../redux/user/userSlice.js";
import apiRequest from "../lib/apiRequest.js";

// firebase essential
import app from "../firebase/firebase.js";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";



// react icons
import { FaSignOutAlt } from "react-icons/fa";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [updateSuccessfull, setUpdateSuccesfull] = useState(false);

  // firebase
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileError, setFileError] = useState(false);

  //
  const fileRef = useRef(null);

  // handleuploadImage

  useEffect(() => {
    if (file) {
      handleProfilePhotoUpload(file);
    }
  }, [file]);

  const handleProfilePhotoUpload = (file) => {
    setFileError("")
    setUploadProgress(0)

    if (!file) {
      console.log("file did not exist");
    }

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const rounded = Math.round(progress);
        setUploadProgress(rounded);
      },
      (error) => {
        setFileError(true);
        console.log("Upload failed", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFileError(false);
          setImageUrl(downloadUrl);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      setUpdateSuccesfull(false);
      const formData = new FormData(e.target);
      const inputs = Object.fromEntries(formData);
      const { email, username, password } = inputs;

      const res = await apiRequest.post(`/user/update/${currentUser._id}`, {
        email,
        username,
        password,
        // imageUrl exist then save it in profilephoto else go currentUser profile photo which the default
        profilePhoto: imageUrl ? imageUrl : currentUser.profilePhoto,
      });

      const data = res.data;

      if (data.success === false) {
        dispatch(updateFailure(data.message));
        return;
      }

      dispatch(updateSuccess(data));
      setUpdateSuccesfull(true);
    } catch (error) {
      console.log(error);
      dispatch(updateFailure(error.response.data.message));
    }
  };


  const handleSignOut = async () => {
    try {
      dispatch(signOutStart())
      const res = await apiRequest.post(`/auth/signout`)
      const data = res.data
      if (data.success === false) {
        dispatch(signOutFailure(data.message))
        return
      }
      localStorage.removeItem("hasShownGreet")
      dispatch(signOutSuccess(data))
    } catch (error) {
      dispatch(signOutFailure(error.response.data.message))
    }
  }

  return (
    <div className="p-6 my-10">

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 items-center border-[#eee] border relative py-[50px] rounded-[10px]
       lg:max-w-4xl mx-auto
        "
      >
        <h1 className="absolute  top-[-20px] rounded-l-lg left-[-1px]  border p-3 py-1 bg-[#171717] text-white">
          PROFILE
        </h1>

        <div className="">
          <input
            hidden
            type="file"
            ref={fileRef}
            accept="image/.*"
            onChange={(e) => setFile(e.target.files[0])}
            name="image"
          />
          <img
            onClick={() => fileRef.current.click()}
            className="border h-[150px] w-[150px] border-[#eee] rounded-full object-cover cursor-pointer"
            src={currentUser.profilePhoto}
          />
        </div>

        <span className="text-sm">
          {fileError ? (
            <span className="text-red-700">{`Image must be less than 3mb`}</span>
          ) : uploadProgress > 0 && uploadProgress < 100 ? (
            <span className="text-white">{`Uploading ${uploadProgress}%`}</span>
          ) : uploadProgress === 100 ? (
            <span className="text-green-700">Image Successfully uploaded</span>
          ) : (
            ""
          )}
        </span>

        <div className="flex flex-col gap-3">
          <input
            className="p-4  rounded-[10px] border-[1px] text-white bg-[#3a3a3a] outline-none border-[#eee] 
            md:px-[50px]
            "
            name="email"
            placeholder="email"
            defaultValue={currentUser.email}
            type="email"
          />
          <input
            className="p-4  rounded-[10px] border-[1px] text-white bg-[#3a3a3a] outline-none border-[#eee] 
            md:px-[50px]
            "
            name="username"
            placeholder="username"
            defaultValue={currentUser.username}
            type="text"
          />
          <input
            className="p-4  rounded-[10px] border-[1px] text-white bg-[#3a3a3a] outline-none border-[#eee] 
            md:px-[50px]
            "
            name="password"
            placeholder="password"
            type="password"
          />
        </div>

        <div className="flex gap-3">
          <button
            disabled={loading}
            className="border rounded-[10px] p-3 px-6 hover:bg-[#eee] hover:text-black"
          >
            {loading ? "UPDATING.." : "UPDATE"}
          </button>
          {/* IF APLICABLE ADD ANOTHER BUTTON */}
        </div>

        <span className="self-center text-red-700">{error && error}</span>

        <span className="self-center text-green-700">
          {updateSuccessfull && "Successfully updated!"}
        </span>
        <div className="absolute rounded-b-[10px] bottom-0 left-0 right-0 mx-auto bg-[#eee] h-[40px]">
          {/* white background */}
        </div>
        {/* sign out button */}
        <div className="absolute right-3 top-3">
        <button onClick={handleSignOut} type="button" className=" border p-3 px-6 hover:bg-[#eee] rounded-[10px] hover:text-black">
            <FaSignOutAlt/>
        </button>
        </div>
      </form>
    </div>
  );
}
