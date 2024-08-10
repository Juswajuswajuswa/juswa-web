import { CiWarning } from "react-icons/ci";


export default function ValidationModal({ error, errorMessage }) {

  return (
    <div
      className={`fixed right-5 bottom-[70px] md:bottom-[30px] border p-2 rounded-[10px] bg-[#171717] transition-all ${
        error ? "translate-x-0" : "translate-x-[500px]"
      }`}
    >
      <div className="flex space-x-1">
      <CiWarning className="text-red-700 size-5" />
      <p className="text-red-700 font-bold text-sm uppercase">{errorMessage}</p>
      </div>
    </div>
  );
}
