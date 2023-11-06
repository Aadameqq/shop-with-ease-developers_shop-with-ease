import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const HeaderDrawer = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    document.querySelector("body").style.overflow = "hidden";
    return () => (document.querySelector("body").style.overflow = "auto");
  }, []);

  return (
    <div className="absolute left-0 top-[60px] z-20 h-[calc(100vh-60px)] w-screen bg-white">
      <div className="flex h-full w-full flex-col justify-between px-5 pb-6 pt-8">
        <div className="flex flex-col gap-4">
          {!session ? (
            <Link
              href="/"
              className="text-lg text-zinc-700"
            >
              Strona główna
            </Link>
          ) : (
            <>
              <Link
                className="mr-4 text-lg text-zinc-700"
                href="/lists"
              >
                Moje listy zakupów
              </Link>
              <Link
                className="text-lg text-zinc-700"
                href="/recipes"
              >
                Moje przepisy
              </Link>
            </>
          )}
        </div>

        <div className="flex w-full justify-center">
          {!session ? (
            <>
              {" "}
              <button
                className="mr-4 w-1/2 rounded-md border-2 border-blue-500 px-4   py-2 text-blue-500"
                onClick={signIn}
              >
                Zaloguj się
              </button>
              <button
                className="w-1/2 rounded-md border-2 border-blue-500 bg-blue-500 px-4  py-2 text-white"
                onClick={() => router.push("/auth/register")}
              >
                Zarejestruj się
              </button>
            </>
          ) : (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center ">
                <p className="ml-3 mr-4 text-xl">Adam Bryndza</p>
              </div>
              <button
                className="md rounded-lg bg-red-500 px-4 py-3 text-white"
                onClick={signOut}
              >
                Wyloguj się
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
