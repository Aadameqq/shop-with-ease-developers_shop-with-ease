import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsList, BsX } from "react-icons/bs";
import { HeaderDrawer } from "./HeaderDrawer";
import { useEffect, useState } from "react";

export const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [isToggled, setIsToggled] = useState(false);

  const toggle = () => {
    setIsToggled((prev) => !prev);
  };

  useEffect(() => {
    setIsToggled(false);
  }, [router.route]);

  return (
    <>
      <header className="absolute left-0 top-0 z-30 flex h-[70px] w-full items-center justify-between px-5 shadow-sm shadow-zinc-300 md:px-10 xl:px-20">
        {session && (
          <>
            <div className="flex items-center">
              <h2 className="text-xl text-zinc-700 lg:text-2xl">
                ShopWithEase
              </h2>
              <div className="ml-9 hidden md:block">
                <Link
                  className="mr-4 text-zinc-700"
                  href="/lists"
                >
                  Moje listy zakupów
                </Link>
                <Link
                  className="text-zinc-700"
                  href="/recipes"
                >
                  Moje przepisy
                </Link>
              </div>
            </div>

            <p className="hidden text-lg text-zinc-600 md:block">
              {session.user.name} ({" "}
              <button
                className="text-red-500 underline underline-offset-1 "
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Wyloguj
              </button>{" "}
              )
            </p>
          </>
        )}

        {!session && (
          <>
            <div className="flex items-center">
              <h2 className="text-xl text-zinc-700 lg:text-2xl">
                ShopWithEase
              </h2>
              <div className="ml-9 hidden md:block">
                <Link
                  href="/"
                  className="text-zinc-700"
                >
                  Strona główna
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <button
                className="mr-4 rounded-md border-2 border-blue-500 px-4 py-2   text-blue-500"
                onClick={signIn}
              >
                Zaloguj się
              </button>

              <button
                className="rounded-md border-2 border-blue-500 bg-blue-500 px-4 py-2  text-white"
                onClick={() => router.push("/auth/register")}
              >
                Zarejestruj się
              </button>
            </div>
          </>
        )}
        <button
          className="flex flex-col gap-[5px] md:hidden"
          onClick={toggle}
        >
          <div
            className={`h-[3px] w-[30px] rounded-md bg-zinc-600 transition-all ease-in-out ${
              isToggled && "translate-y-[8px] -rotate-45"
            }`}
          ></div>
          <div
            className={`h-[3px] w-[30px] rounded-md bg-zinc-600 transition-all ease-in-out ${
              isToggled && "opacity-0"
            }`}
          ></div>
          <div
            className={`h-[3px] w-[30px] rounded-md bg-zinc-600 transition-all ease-in-out ${
              isToggled && "-translate-y-[8px] rotate-45"
            }`}
          ></div>
        </button>
      </header>
      {isToggled && <HeaderDrawer />}
    </>
  );
};
