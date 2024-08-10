import { Link, Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import Botvar from "../components/Botvar";
import { TiArrowSortedUp } from "react-icons/ti";
import { TiArrowSortedDown } from "react-icons/ti";
import { useState } from "react";
import { IoReturnUpBack, IoReturnUpBackOutline } from "react-icons/io5";
import ValidationModal from "../components/ValidationModal";

function RooutLayout() {
  return (
    <div className="font-main">
      <header>
        <Header />
      </header>

      <main className="">
        <Outlet />
      </main>
    </div>
  );
}

function RequiredAuth() {
  const { currentUser } = useSelector((state) => state.user);
  const [isClicked, setIsClicked] = useState(false);
  return !currentUser ? (
    <Navigate to={`/sign-in`} />
  ) : (
    <div className="relative font-main ">
      <header>
        <Header />
      </header>

      <main className="relative">
        <Outlet />
        <div
          className={`fixed bottom-[0] ${
            isClicked === true ? "translate-y-[0]" : "translate-y-[65px]"
          }  transition-all flex justify-center w-full py-3`}
        >
          <div className="flex flex-col items-center">
            <button className="text-[#eee]" onClick={() => setIsClicked((prev) => !prev)}>
              {!isClicked ? (
                <TiArrowSortedUp className="size-10" />
              ) : (
                <TiArrowSortedDown className="size-10" />
              )}
            </button>
            <Botvar />
          </div>
        </div>
      </main>
    </div>
  );
}

export { RooutLayout, RequiredAuth };
