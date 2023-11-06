import { getServerSession } from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";
import { Work_Sans } from "next/font/google";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]";

const headerFont = Work_Sans({ subsets: ["latin"], weight: ["800", "900"] });

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className={headerFont.className + " text-4xl font-black md:text-6xl"}>
        SHOP WITH EASE
      </h1>
      <p className="text-md mb-3 md:mb-5 md:text-lg">
        Spraw by zakupy były przyjemnością
      </p>
      <Link
        href="/auth/register"
        className="rounded-2xl border-2 border-zinc-500 px-10 py-2 font-bold shadow-md shadow-zinc-600 transition ease-in-out hover:shadow-lg hover:shadow-zinc-800"
      >
        Zarejestruj się
      </Link>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return { redirect: { destination: "/lists" } };
  }

  return {
    props: {},
  };
}
