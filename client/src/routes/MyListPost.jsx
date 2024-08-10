import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../lib/apiRequest";
import { useSelector } from "react-redux";
import ValidationSuccess from "../components/ValidationSuccess";
export default function MyListPost() {
  const { currentUser } = useSelector((state) => state.user);
  const [postList, setPostList] = useState([]);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  // for search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFiltered, setSearchFilterd] = useState(postList);

  useEffect(() => {
    const fetchUserPost = async () => {
      try {
        const res = await apiRequest.get(`/post/user/${currentUser._id}/posts`);
        const data = res.data;
        if (data.success === false) {
          console.log(data.message);
        }
        setPostList(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserPost();
  }, [currentUser._id]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const filterTitles = () => {
      const filtered = postList.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchFilterd(filtered);
    };
    filterTitles()
  }, [searchTerm, postList]);


  const handleDeletePost = async (listId) => {
    try {
      const res = await apiRequest.delete(`/post/delete/${listId}`);
      const data = res.data;
      if (data.success === false) {
        console.log(data.message);
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
      setPostList((prevPostList) =>
        prevPostList.filter((list) => list._id !== listId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditPost = (listId) => {
    navigate(`/edit/${listId}`);
  };

  return (
    <div className="p-6 pb-[120px] mt-10">
      <div className="border border-[#eee] h-[700px] p-3 rounded-[10px] pt-[30px] relative lg:max-w-5xl mx-auto">
        <h1 className="absolute top-[-20px] rounded-l-lg left-[-1px]  border p-3 py-1 bg-[#171717] text-white">
          MY POST LIST
        </h1>
        <div className="flex items-center relative">
          <input
            type="text"
            className="bg-[#3a3a3a] rounded-[10px] w-full border-[1px] border-[#eee] p-3 text-white"
            placeholder="search for title"
            value={searchTerm}
            onChange={handleChange}
          />
          <button className="absolute right-0">
            <CiSearch className=" size-[35px] mr-1 cursor-pointer" />
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2 mt-3">
          <select name="" id="" className="bg-[#3a3a3a] p-1 rounded-[10px] ">
            <option value="POEM">POEM</option>
          </select>
          <select name="" id="" className="bg-[#3a3a3a] p-1 rounded-[10px] ">
            <option value="SORT">SORT</option>
          </select>
          </div>
          <div className="mt-3 p-1">
            <p className="">

              {
                postList.length > 0 ? `total list: ${postList.length}` : "no list available"
              }
            </p>
          </div>
        </div>
        {/* MY LIST POST */}
        <div className="">
          <div className="h-[510px] rounded-[10px] overflow-y-auto">
            {searchFiltered.map((list) => (
              <div key={list._id}>
                <div className="flex justify-between border p-3 rounded-[10px] mt-3">
                  <p className="truncate">{list.title}</p>

                  <div className="flex space-x-2">
                    {/* redirecting to post that contain same ID - list._id and singlePage ._id */}
                    <Link to={`/${list._id}`}>
                      <button>Show</button>
                    </Link>
                    <button
                      onClick={() => handleEditPost(list._id)}
                      type="button"
                      className="text-green-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(list._id)}
                      type="button"
                      className="text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute rounded-b-[10px] bottom-0 left-0 right-0 mx-auto bg-[#eee] h-[40px]">
          {/* white background */}
        </div>
      </div>
      {success && (
        <ValidationSuccess
          success={success}
          successMessage={"Successfully deleted"}
        />
      )}
    </div>
  );
}
