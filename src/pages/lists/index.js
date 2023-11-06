import { SingleList } from "@/components/SingleList";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { db } from "@/utils/prismaClient";

export default function Lists({ lists }) {
  return (
    <div className="flex h-full w-full flex-col items-center gap-3 pt-36">
      <h1 className="mb-12 text-3xl md:text-4xl">Twoje listy zakupów</h1>
      {lists.map(({ title, id }) => (
        <SingleList
          title={title}
          id={id}
          key={id}
        />
      ))}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  const { id } = session.user;

  const { lists } = await db.user.findUnique({
    where: { id },
    include: { lists: true },
  });

  return { props: { lists } };
}
