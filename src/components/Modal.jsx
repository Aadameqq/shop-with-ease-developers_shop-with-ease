import { useEffect, useState } from "react";
import { BsX } from "react-icons/bs";

export const Modal = ({ title, isOpened, close, children, isUncloseable }) => {
  const [delayedIsOpened, setDelayedIsOpened] = useState(isOpened);

  useEffect(() => {
    const persistedIsOpened = isOpened;
    if (persistedIsOpened) return setDelayedIsOpened(persistedIsOpened);
    const timeout = setTimeout(() => {
      setDelayedIsOpened(persistedIsOpened);
    }, 300);
    return () => clearTimeout(timeout);
  }, [isOpened]);
  const handleBackgroundClick = (e) => {
    if (e.target.id === "bg") {
      close();
    }
  };

  return (
    <div
      id="bg"
      className={
        (!isOpened
          ? "animate-[disappear_0.35s_ease-in-out] "
          : "animate-[appear_0.3s_ease-in-out] ") +
        (!delayedIsOpened && " hidden") +
        " fixed left-0 top-0 z-40 box-border flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 transition-all ease-in-out"
      }
      onClick={handleBackgroundClick}
    >
      <div className="z-50 h-full w-full max-w-[1000px] -translate-x-[8.5px] bg-white p-5 px-8 md:h-auto md:w-4/6 md:rounded-md">
        <div className="mb-5 flex justify-between">
          <h1 className="mt-[3px] text-2xl">{title}</h1>
          <button
            onClick={close}
            className="translate-x-[4px]"
          >
            {!isUncloseable && <BsX size={35} />}
          </button>
        </div>

        <div className="px-3">{children}</div>
      </div>
    </div>
  );
};
