import { getServerSession } from "next-auth";
import { db } from "@/utils/prismaClient";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      get(req, res);
      break;
    default:
      res.status(404).send();
  }
}

const get = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).send();

  const { q } = req.query;

  const hints = await db.hint.findMany({
    where: { owner: { id: session.user.id }, content: { contains: q } },
  });

  res.status(200).json(hints.map(({ content }) => content));
};
