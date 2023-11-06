import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]";
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

  const { listId, recipeId } = req.query;

  const found = await db.user.findUnique({
    where: {
      id: session.user.id,
      lists: { some: { id: Number(listId) } },
      recipes: { some: { id: Number(recipeId) } },
    },
    include: { lists: true, recipes: true },
  });

  if (!found) return res.status(404).send();

  const { ingredients } = await db.recipe.findUnique({
    where: { id: Number(recipeId) },
    include: { ingredients: true },
  });

  const queries = ingredients.map(({ content }) => {
    return db.product.create({
      data: {
        content,
        createdAt: 0,
        list: {
          connect: {
            id: listId,
          },
        },
      },
    });
  });

  const created = await db.$transaction(queries);

  res.status(201).json(created);
};
