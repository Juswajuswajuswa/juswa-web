import { FaRegCheckCircle } from "react-icons/fa";

export default function ValidationSuccess({ success, successMessage }) {
  return (
    <div
      className={`fixed right-5 bottom-[70px] md:bottom-[30px] border p-2 rounded-[10px] bg-[#171717] transition-all ${
        success === true ? "translate-x-0" : "translate-x-[500px]"
      }`}
    >
      <div className="flex space-x-1">
        <FaRegCheckCircle className="bg-green-700 rounded-full" />
        <p className="text-green-700 font-bold text-sm uppercase">
          {successMessage}
        </p>
      </div>
    </div>
  );
}
