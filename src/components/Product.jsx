import { BiCircle, BiSolidCircle } from "react-icons/bi";

export const Product = ({ content, toggle, shouldAnimateRemoval, remove }) => {
  const handleTransitionEnd = () => {
    shouldAnimateRemoval && remove();
  };
  return (
    <div
      className={`flex items-center justify-between rounded-xl bg-zinc-100  pl-4 shadow-md shadow-zinc-200 transition-all duration-300 ease-in-out ${
        shouldAnimateRemoval && "opacity-0"
      }`}
      onTransitionEnd={handleTransitionEnd}
    >
      <p
        className={`break-all py-4 text-zinc-700 ${
          shouldAnimateRemoval && "line-through"
        }`}
      >
        {content}
      </p>{" "}
      <button
        className="px-4 py-4"
        onClick={toggle}
      >
        {shouldAnimateRemoval ? (
          <BiSolidCircle
            size={25}
            className="text-zinc-500"
          />
        ) : (
          <BiCircle
            size={25}
            className="text-zinc-500"
          />
        )}
      </button>
    </div>
  );
};
