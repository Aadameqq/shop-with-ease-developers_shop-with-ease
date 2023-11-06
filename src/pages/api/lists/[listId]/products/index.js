import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
import { db } from "@/utils/prismaClient";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      create(req, res);
      break;
    default:
      res.status(404).send();
  }
}

const create = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).send();

  const { listId } = req.query;

  const found = await db.list.findUnique({
    where: { id: Number(listId), members: { some: { id: session.user.id } } },
    include: { members: true },
  });

  if (!found) return res.status(404).send();

  const { content } = req.body;
  const dateTime = 1;

  const created = await db.product.create({
    data: {
      content,
      createdAt: dateTime,
      list: {
        connect: {
          id: listId,
        },
      },
    },
    include: {
      list: true,
    },
  });

  const foundHint = await db.hint.findFirst({ where: { content } });

  if (!foundHint)
    await db.hint.create({
      data: {
        content,
        owner: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

  res.status(201).json(created);
};
