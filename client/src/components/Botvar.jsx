import { Link } from "react-router-dom";

export default function Botvar() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="border rounded-full p-3 space-x-4 bg-[#171717]">
      <Link to={'/'} onClick={scrollToTop}  className="hover:bg-white  text-[#eee] p-3 rounded-lg hover:text-black ">HOME</Link>
      <Link to={`/add-post`} className="hover:bg-white p-3 rounded-lg text-[#eee]  hover:text-black ">
        POST
      </Link>
      <Link to={`/my-list`} className="hover:bg-white p-3 rounded-lg text-[#eee]  hover:text-black ">MYLIST</Link>
    </div>
  );
}
