import { useNavigate, useParams } from "react-router-dom"
import apiRequest from "../lib/apiRequest"
import { useEffect, useState } from "react"
import ValidationModal from "../components/ValidationModal"
import ValidationSuccess from "../components/ValidationSuccess"


export default function EditPost() {

  const params = useParams()  
  const navigate = useNavigate()
  const [currentListData, setCurrenttListData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [successfullPosted, setSuccessfullPosted] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  console.log(errorMessage)


  useEffect(() => {
    const fetchUserPostToEdit = async () => {
      try {
        const editPostId = params.editPostId
        const res = await apiRequest.get(`/post/get/${editPostId}`)
        const data = res.data
        if (data.success === false) {
          console.log(data.message)
        }
        setCurrenttListData(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchUserPostToEdit()

  }, [])
  
  const handleEditPost = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);
  
    try {
      setLoading(true);
      setError(false);
      const editPostId = params.editPostId;
      const res = await apiRequest.put(`post/edit/${editPostId}`, {
        ...inputs
      });
      const data = res.data;
      if (data.success === false) {
        setError(true);
        setErrorMessage(data.message);
        setLoading(false);
        return;
      }
      setSuccessfullPosted(true);
      setLoading(false);
      setError(false);
      navigate(`/`)
    } catch (error) {
      setError(true);
      setLoading(false);
      setErrorMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleChange = (e) => {
    setCurrenttListData({
      ...currentListData,
      [e.target.name]: e.target.value
    });
  };


  return (
    <div className='p-6 pb-[120px] mt-10'>
         <form onSubmit={handleEditPost}
        // onSubmit={handleEditPost}
        className="flex flex-col gap-[50px] md:flex-row lg:max-w-6xl mx-auto"
      >
        <div className="flex flex-[1] h-[290px] pb-[50px] flex-col p-3 gap-2 border-[#eee] border rounded-[10px] pt-[30px] relative md:pb-0">
          <h1 className="absolute top-[-20px] rounded-l-lg left-[-1px]  border p-3 py-1 bg-[#171717] text-white">
            EDIT POST PREVIEW
          </h1>

          <div className="flex flex-row items-center space-x-2">
            <label htmlFor="category">Post to</label>
            <select
              name="categories"
              id="category"
              className="bg-[#3a3a3a] p-1"
            >
              <option value="poem">Poem section</option>
              <option value="blogs">Blogs section</option>
              <option value="story">Story section</option>
            </select>
          </div>

          <div className="">
            <input
              type="text"
              name="previewTitle"
              id="previewTitle"
              className="w-full rounded-[10px] bg-[#3a3a3a] text-white p-4"
              placeholder="Title.."
              value={currentListData.previewTitle}
              onChange={handleChange}
            />
          </div>

          <div className="">
            <textarea
              name="previewContent"
              id="previewContent"
              className="bg-[#3a3a3a] resize-none h-[100%] w-full rounded-[10px] p-4"
              placeholder="Content.."
              value={currentListData.previewContent}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="absolute rounded-b-[10px] bottom-0 left-0 right-0 mx-auto bg-[#eee] h-[40px]">
            {/* white background */}
          </div>
        </div>


        {/* ///////// */}
        <div className="flex flex-[2] flex-col p-3 gap-2 border-[#eee] border rounded-[10px] pt-[30px] pb-[60px] relative">
          <h1 className="absolute top-[-20px] rounded-l-lg left-[-1px]  border p-3 py-1 bg-[#171717] text-white">
            EDIT POST
          </h1>

          <div className="">
            <input
              type="text"
              name="title"
              id="title"
              className="w-full rounded-[10px] bg-[#3a3a3a] text-white p-4"
              placeholder="Title.."
              value={currentListData.title}
              onChange={handleChange}
            />
          </div>

          <div className="">
            <textarea
              name="content"
              id="content"
              className="bg-[#3a3a3a] resize-none min-h-[500px] w-full rounded-[10px] p-4"
              placeholder="Content.."
              value={currentListData.content}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="flex justify-center">
            <button disabled={loading} className="border rounded-[10px] p-3 px-6 hover:bg-[#eee] hover:text-black">
              {
                loading ? "EDDITING..." : "EDIT POST"
              }
            </button>
          </div>
          <div className="absolute rounded-b-[10px] bottom-0 left-0 right-0 mx-auto bg-[#eee] h-[40px]">
            {/* white background */}
          </div>

        </div>
          {
            error && (
              <ValidationModal error={error} errorMessage={errorMessage} />
            )
          }
          {
            successfullPosted && (
              <ValidationSuccess success={successfullPosted} successMessage={"successfully edited"}/>
            )
          }
      </form>
    </div>
  )
}
