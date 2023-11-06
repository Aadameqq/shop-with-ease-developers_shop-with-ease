import { useState } from "react";
import { Modal } from "@/components/Modal";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { db } from "@/utils/prismaClient";

export default function Recipes({ recipes }) {
  const [isOpened, setIsOpened] = useState(false);

  const [ingredients, setIngredients] = useState([]);

  const handleClick = (currentIngredients) => {
    setIngredients(currentIngredients);
    setIsOpened(true);
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-3 pt-36">
      <h1 className="mb-12 text-3xl md:text-4xl">Twoje przepisy</h1>
      {recipes.map((recipe) => (
        <button
          onClick={() => handleClick(recipe.ingredients)}
          className="w-full max-w-[800px] cursor-pointer"
        >
          <div className=" flex w-full  flex-col items-center justify-between rounded-md border-2 border-zinc-200 bg-zinc-50 px-3 py-3 transition-all ease-in-out hover:bg-white hover:shadow-md md:flex-row">
            <h3 className=" text-lg text-zinc-700 ">{recipe.title}</h3>
          </div>
        </button>
      ))}
      <Modal
        title={"Składniki"}
        isOpened={isOpened}
        close={() => setIsOpened(false)}
      >
        <div className="mt-6 flex w-full max-w-[1000px] flex-col gap-3 pb-3">
          {ingredients.map(({ content }) => (
            <div
              className={`flex items-center justify-start rounded-xl bg-zinc-100 p-4  pl-4 shadow-md shadow-zinc-200 transition-all duration-300 ease-in-out`}
            >
              <p className={`text-zinc-700 `}>{content}</p>{" "}
            </div>
          ))}
        </div>
      </Modal>
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

  const recipes = await db.recipe.findMany({
    where: { owner: { id } },
    include: { owner: true, ingredients: true },
  });

  return {
    props: {
      recipes: recipes.map(({ id, title, ingredients }) => ({
        id,
        title,
        ingredients,
      })),
    },
  };
}
