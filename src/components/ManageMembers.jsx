import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "axios";
import { BiSolidUserAccount } from "react-icons/bi";
import { BsPersonFill } from "react-icons/bs";

const generateCode = () => {
  const chars = "qwertyuiopasdfghjklzxcvbnm1234567890";
  return [...new Array(6)].reduce((acc) => {
    return acc + chars[Math.floor(Math.random() * chars.length)];
  }, "");
};

export const ManageMembers = ({ members }) => {
  const [isOpened, setIsOpened] = useState(false);

  const open = () => {
    setIsOpened(true);
  };

  const close = () => {
    setIsOpened(false);
  };

  const [currentCode, setCurrentCode] = useState("");

  useEffect(() => {
    setCurrentCode(generateCode);
  }, []);

  return (
    <>
      <button
        className={`rounded-2xl bg-zinc-500 px-8 py-3 text-white shadow-md shadow-zinc-400 md:px-5 md:py-2`}
        onClick={open}
      >
        {"Zarządzaj członkami"}
      </button>
      <Modal
        title="Zarządzanie członkami"
        isOpened={isOpened}
        close={close}
      >
        <h4 className="mb-3 mt-6   text-xl text-zinc-700">Lista członków</h4>

        <div className="flex flex-col   ">
          {members.map(({ username }) => (
            <p className="flex items-center border-b  border-zinc-200 py-2   text-zinc-700">
              <span className="mr-3 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-zinc-200 text-lg shadow-sm shadow-zinc-400">
                {username[0].toUpperCase()}
              </span>
              {username}
            </p>
          ))}
        </div>

        <h4 className="mb-3 mt-8 text-xl text-zinc-700">Kod zaproszenia</h4>
        <div className="py-3">
          <div className="mb-5 rounded-md bg-zinc-100 px-5 py-3  text-center text-zinc-800 shadow-md">
            {currentCode}
          </div>
        </div>
      </Modal>
    </>
  );
};
