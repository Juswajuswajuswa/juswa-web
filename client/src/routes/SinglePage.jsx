import { RiArrowDownDoubleFill } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import apiRequest from "../lib/apiRequest";
import { useNavigate, useParams } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import ValidationSuccess from "../components/ValidationSuccess";
import ValidationModal from "../components/ValidationModal";

export default function SinglePage() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const params = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const postListId = params.postListingId;
        const res = await apiRequest.get(`/post/get/${postListId}`);
        const data = res.data;
        if (data.success === false) {
          console.log(data.message);
        }
        setPost(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchComments = async () => {
      try {
        const postListId = params.postListingId;
        const res = await apiRequest.get(`/post/${postListId}/comment`);
        const data = res.data;
        setComments(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
    fetchAllPost();
  }, [params.postListingId]);

  const showDelete = () => {
    setIsClicked((prev) => !prev);
    console.log(isClicked);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const postListId = params.postListingId;
      const res = await apiRequest.post(`/post/${postListId}/comment`, {
        content: newComment,
      });
      const data = res.data;
      if (data.success === false) {
        console.log(data.message);
        setErrorMessage(data.message)
      }

      setComments([...comments, data]);
      setNewComment("");
    } catch (error) {
      console.log(error);
      setError(true)
      setErrorMessage(error.response.data.message)
      setTimeout(() => {
        setError(false)
      }, 2000)
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await apiRequest.delete(`/post/comment/${commentId}`);
      const data = res.data;
      if (data.success === false) {
        console.log(data.message);
        setErrorMessage(data.message)
      }
      setComments(comments.filter((comment) => comment._id !== commentId));
      setSuccess(true)
      setSuccessMessage(data.message)
      setError(false)
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 2000)
      setSuccess(false)
      setErrorMessage(error.response.data.message || 'An error occurred');
    }
  };


  const handleDeletePost = async () => {
    const postListId = params.postListingId;
    try {
      const res = await apiRequest.delete(`/post/delete/${postListId}`)
      const data = res.data 
      if (data.success === false) {
        setError(true)
        setErrorMessage(data.message)
      }
      console.log(data)
      setError(false)
      setSuccess(true)
      navigate(`/`)
    } catch (error) {
      console.log(error)
      setError(true)
      setTimeout(() => {
        setError(false)

      }, 2000)
      setErrorMessage(error.response.data.message)
    }
  }


  return (
    <div className="p-6 pb-[120px] mt-10">
      {!post ? (
        <div className="text-center text-2xl">Loading...</div>
      ) : (
        <div className="flex flex-col  gap-10 md:flex-row lg:max-w-6xl mx-auto">
          <div className="flex-[2] border rounded-[10px] p-3 pb-[60px] relative">
            <div className="absolute right-3">
              <div className="relative">
                <button className="" onClick={() => showDelete()}>
                  <BsThreeDots className="text-xl md:text-2xl" />
                </button>
                {/* OPENING DELETE MODAL: IF ISCLICKED IS TRUE THEN SHOW MODAL */}
                {isClicked && (
                  <div className="absolute top-5 right-0 border flex items-center bg-[#eee] text-black p-1 rounded-[10px]">
                    <button className="text-xs md:text-sm text-red-700 font-semibold" onClick={() => handleDeletePost()}>DELETE</button>
                  </div>
                )}
              </div>
            </div>

            <h1 className="absolute top-[-20px] rounded-l-lg left-[-1px] border p-3 py-1 bg-[#171717] text-white">
              Posted By: <span>{post.userId.username || "Unknown"}</span>
            </h1>

            <div className="text-center flex flex-col lg:p-6">
              <h1 className="text-xl md:text-3xl my-5 mt-[50px]">
                {post.title || "Untitled"}
              </h1>

              <div className="overflow-y-auto  mx-auto">
                <p className=" md:text-[19px]  leading-[30px] md:leading-[35px]">
                  {post.content || "No content available"}
                </p>
              </div>
            </div>
            <div className="absolute rounded-b-[10px] bottom-0 left-0 right-0 mx-auto bg-[#eee] h-[40px]">
              {/* white background */}
            </div>
          </div>

          <div className="flex-[1] h-[400px] relative p-3  border rounded-[10px]">
            <h1 className="absolute  top-[-20px] rounded-l-lg left-[-1px] border p-3 py-1 bg-[#171717] text-white">
              Comments
            </h1>
            <div className="">
              <div className="flex-[2] p-3 pt-[20px] flex items-center relative">
                <input
                  type="text"
                  className="text-white w-full bg-[#3a3a3a] p-2 border rounded-[10px]"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="add a comment"
                />
                <button
                  className="absolute right-6"
                  onClick={handleCommentSubmit}
                >
                  <RiArrowDownDoubleFill className="size-[30px] w-[25px]" />
                </button>
              </div>
              
            </div>
            <div className=" flex flex-col h-[300px] overflow-y-auto space-y-2">
              {comments.map((comment) => (
                // <li className="" key={comment._id}>{comment.content}</li>
                <div
                  className="p-3 flex justify-between  bg-[#3a3a3a] rounded-[10px]"
                  key={comment._id}
                >
                  <div className="flex space-x-2">
                    <p className=" text-gray-300">
                      {comment.userId.username}:{" "}
                    </p>
                    <p className=" text-gray-white">{comment.content}</p>
                  </div>
                  <div className="">
                    <button onClick={() => handleDeleteComment(comment._id)}>
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {
        success && (
          <ValidationSuccess success={success} successMessage={successMessage} />
        )
      }
      {
        error && (
          <ValidationModal error={error} errorMessage={errorMessage} />
        )
      }
    </div>
  );
}
