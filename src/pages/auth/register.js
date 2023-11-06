import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

export default function SignIn() {
  return (
    <div className="flex h-full w-screen flex-col items-center justify-center">
      <div className="flex max-w-[500px] flex-col items-center justify-center">
        <h1 className="text-4xl text-zinc-800">Rejestracja</h1>
        <p className="mb-7 mt-7 text-center text-zinc-600">
          Rejestracja jest niedostępna w wersji demonstracyjnej aplikacji. Aby
          przetestować funkcjonalności wymagające bycia zalogowanym, skorzystaj
          z poniższych kont:
        </p>
        <h4 className="mb-3 text-xl">1</h4>
        <div className="w-full rounded-md bg-zinc-100 px-3 py-2">
          <span className="noselect text-zinc-600">Email:</span>{" "}
          <span className="">abc@abc</span>
        </div>
        <div className="mt-2 w-full rounded-md bg-zinc-100 px-3 py-2">
          <span className="noselect text-zinc-600">Hasło:</span>{" "}
          <span className="">abc123</span>
        </div>
        <h4 className="mb-3 mt-7 text-xl">2</h4>
        <div className="w-full rounded-md bg-zinc-100 px-3 py-2">
          <span className="noselect text-zinc-600">Email:</span>{" "}
          <span className="">def@def</span>
        </div>
        <div className="mt-2 w-full rounded-md bg-zinc-100 px-3 py-2">
          <span className="noselect text-zinc-600">Hasło:</span>{" "}
          <span className="">def456</span>
        </div>
      </div>
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
