import { getServerSession } from "next-auth";
import { db } from "@/utils/prismaClient";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  switch (req.method) {
    case "DELETE":
      remove(req, res);
      break;
    default:
      res.status(404).send();
  }
}

const remove = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).send();

  const { listId, productId } = req.query;

  const found = await db.list.findUnique({
    where: {
      id: Number(listId),
      members: { some: { id: session.user.id } },
      products: { some: { id: Number(productId) } },
    },
    include: { members: true, products: true },
  });

  if (!found) return res.status(404).send();

  await db.product.delete({ where: { id: Number(productId) } });

  res.status(200).send();
};
