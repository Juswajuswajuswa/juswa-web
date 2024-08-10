import { Link } from "react-router-dom";
import { CiLock } from "react-icons/ci";

export default function Topvar() {
  return (
    <div
      className="flex text-center absolute justify-center right-0 left-0 mx-auto top-0 rounded-full 
      space-x-2"
    >
      <Link className="border-[#eee] border-[1px] text-sm p-1 px-3 rounded-[10px] bg-[#eee] text-black hover:bg-black hover:text-white
      hover:translate-y-[-2px] transition-all
      " >POEM</Link>
      <Link className="border-[#eee] border-[1px]  p-1 px-2 rounded-[10px] bg-[#eee] text-black hover:bg-black hover:text-white
      hover:translate-y-[-2px] transition-all
      " ><CiLock className="size-[23px]" /></Link>
      <Link className="border-[#eee] border-[1px]  p-1 px-2 rounded-[10px] bg-[#eee] text-black hover:bg-black hover:text-white
      hover:translate-y-[-2px] transition-all
      " ><CiLock className="size-[23px]" /></Link>
    </div>
  );
}
