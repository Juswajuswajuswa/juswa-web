import { useSelector } from "react-redux";
import Topvar from "./Topvar";
import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import apiRequest from "../lib/apiRequest";
// format time
import { formatDistanceToNow } from 'date-fns'

export default function HomePage() {
  const { currentUser } = useSelector((state) => state.user);
  const [allPost, setAllPost] = useState([]);
  const [loading, setLoading] = useState(false)

  // supposed to be there would be a button the if click it would scroll to top
  // if user scrolled 50% of the document or view height then there would be a button that would
  // show up and that button is the first sentence

  // const [windowPosition, setWindowPosition] = useState(0)
  // const [isHalfScrolled, setIsHalfScrolled] = useState(false)

  // console.log(isHalfScrolled)

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollPosition = window.pageYOffset;
  //     const documentHeight = document.documentElement.scrollHeight;
  //     const windowHeight = window.innerHeight;
  //     const scrollPercentage = (scrollPosition + windowHeight) / documentHeight;

  //     setWindowPosition(scrollPosition);
  //     setIsHalfScrolled(scrollPercentage >= 0.5);
  //   };

  //   window.addEventListener('scroll', handleScroll);

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        setLoading(true)
        const res = await apiRequest.get(`/post/get`);
        const data = res.data;
        if (data.success === false) {
          console.log(data.message);
        }
        setAllPost(data);
        setLoading(false)
      } catch (error) {
        setLoading(true)
        console.log(error);
      }
    };
    fetchAllPost();
  }, [currentUser.postId]);


  return (
    <div className="p-6 mt-10 pt-[80px] pb-10 relativer">
      <Topvar />
      <div className=" mt-5 flex flex-col gap-[50px] md:max-w-2xl mx-auto">
        {
          loading ? (
             <div className="
             text-center">
              <h1 className="text-2xl">Loading...</h1>
             </div>
          ) : (
            allPost.map((post) => (
              <Link to={`/${post._id}`} key={post._id}>
                <div className="rounded-[10px] border h-[400px] p-3 relative">
                  <div className="absolute top-[-23px] right-2">
                    <p className="text-xs text-[#eee]">posted: { formatDistanceToNow( new Date(post.createdAt), {addSuffix: true})}</p>
                  </div>
                  <div className="flex space-x-3 items-center">
                    <img
                      src={post.userId.profilePhoto}
                      className="size-[50px]  rounded-full cursor-pointer object-cover"
                    />
                    <div className="border overflow-y-auto flex items-center justify-center h-[55px] rounded-[10px] bg-[#3a3a3a] text-center p-3 flex-[2]">
                      <h1 className="text-sm md:text-lg">{post.title}</h1>
                    </div>
                  </div>
                  <div className="border p-3 h-[300px] overflow-y-auto mt-3 rounded-[10px] bg-[#3a3a3a] text-white">
                    <p className="text-sm leading-[25px] text-wrap md:text-lg md:leading-[35px]">
                      {post.previewContent}
                    </p>
                  </div>
                </div>
                <div className=" p-2 mt-1 rounded-[10px] space-x-5 flex items-center justify-between">
                  <div className="">
                    <FaRegHeart className="size-[30px]" />
                  </div>
                  <div className="border rounded-[10px] p-2 w-full justify-cn flex space-x-2 md:p-3">
                    {post.comments.length > 0 ? (
                      <div className="flex justify-between items-center flex-row  w-full">
                        <div className="flex space-x-2 ">
                          <p className="text-xs md:text-[17px] whitespace-nowrap">
                            commented by: {post.comments[0].userId.username}:{" "}
                          </p>
                          <p className="text-xs md:text-[17px] text-gray-300 line-clamp-1">
                            {post.comments[0].content}
                          </p>
                        </div>
                        {post.comments.length > 1 ? (
                          <div className="">
                            <p className="text-xs md:text-[17px]">
                              {post.comments.length}
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      <p className="text-xs md:text-[17px]">No comments available</p>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )
        }
      </div>
      
    </div>
  );
}
