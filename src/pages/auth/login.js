import { getCsrfToken } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";

export default function SignIn({ csrfToken }) {
  const router = useRouter();

  return (
    <div className="flex h-full w-screen items-center justify-center">
      <form
        method="post"
        action="/api/auth/callback/credentials"
        className="flex w-full flex-col md:w-[600px]"
      >
        <input
          name="callbackUrl"
          type="hidden"
          defaultValue="/lists"
        />
        <h1 className="mb-12 text-center text-4xl  text-zinc-800">Logowanie</h1>
        <input
          name="csrfToken"
          type="hidden"
          defaultValue={csrfToken}
        />
        <label className="flex flex-col">
          <span className="text-lg text-zinc-600">Email</span>
          <input
            name="email"
            type="text"
            className="
          rounded-md border border-zinc-300 bg-zinc-50
          p-2 
          transition-all
          ease-in-out hover:bg-zinc-100
          "
          />
        </label>
        <label className="mt-3 flex flex-col">
          <span className="text-lg text-zinc-600">Hasło</span>
          <input
            name="password"
            type="password"
            className="
            rounded-md border
             border-zinc-300 bg-zinc-50
            p-2
            transition-all
            ease-in-out hover:bg-zinc-100
            "
          />
        </label>
        {router.query.error === "CredentialsSignin" && (
          <p className="mt-6 text-center text-red-600">
            Login lub hasło są niepoprawne
          </p>
        )}

        <button
          type="submit"
          className=" 
          mt-7
          rounded-md bg-green-500 p-3 text-lg text-white  shadow-md shadow-zinc-500 transition-all ease-in-out hover:shadow-lg hover:shadow-zinc-500
          "
        >
          Zaloguj się
        </button>
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return { redirect: { destination: "/lists" } };
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
