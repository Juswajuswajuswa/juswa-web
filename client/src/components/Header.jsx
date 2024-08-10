import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [showGreet, setShowGreet] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const hasShownGreet = localStorage.getItem('hasShownGreet');
      if (!hasShownGreet) {
        const setTime = setTimeout(() => {
          setShowGreet(true);
        }, 0);

        const setTime2 = setTimeout(() => {
          setShowGreet(false);
          localStorage.setItem('hasShownGreet', 'true');
        }, 3000);

        // Clean up the timeout if the component unmounts before the timeout completes
        return () => {
          clearTimeout(setTime);
          clearTimeout(setTime2); 
        };
      }
    }
  }, [currentUser]);
  return (
    <header className="flex items-center p-6 justify-between max-w-[1240px] mx-auto">
      <div className="relative flex items-center gap-2">
        <Link to={`/`}>
          <h1 id="home"
            className=" text-[18px] font-semibold tracking-wide uppercase border border-[#eee] hover:opacity-95 p-[.4rem] px-[.5rem] rounded-[10px]
          md:text-[20px]
          "
          >
            JUSWA
          </h1>
        </Link>
        <div
            className={`absolute translate-x-[100px] transition-all text-wrap w-[200px] ${showGreet ? "translate-y-[0px]" : "translate-y-[-100px]"}`}
          >
            <p className="uppercase">
              {
                currentUser ? `WELCOME, ${currentUser.username}` : ""
              }
            </p>
        </div>
      </div>

      <nav>
        {currentUser ? (
          <Link to={`/profile`} className="text-[1.1rem]">
            <img
              src={currentUser.profilePhoto}
              alt="img"
              className="rounded-full size-[50px] object-cover"
            />
          </Link>
        ) : (
          <Link to={`/sign-in`} className="text-[1.1rem]">
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}
