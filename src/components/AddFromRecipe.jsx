import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Modal } from "./Modal";
import axios from "axios";

export const AddFromRecipe = ({ recipes, addProduct, listId }) => {
  const [isOpened, setIsOpened] = useState(false);

  const createMutation = useMutation({
    mutationFn: async ({ recipeId }) => {
      const result = await axios.post(
        `/api/lists/${listId}/recipes/${recipeId}`,
      );
      return result.data;
    },
  });

  const handleClick = async ({ id }) => {
    try {
      const products = await createMutation.mutateAsync({ recipeId: id });
      products.forEach(({ content, id }) => {
        addProduct({ content, id });
      });
      setIsOpened(false);
    } catch (err) {}
  };

  const close = () => {
    !createMutation.isPending && setIsOpened(false);
  };

  return (
    <>
      <button
        className={`rounded-2xl  bg-blue-500 px-8 py-3 text-white shadow-md shadow-zinc-400 md:px-5 md:py-2`}
        onClick={() => setIsOpened(true)}
      >
        {"Dodaj składniki przepisu"}
      </button>
      <Modal
        title="Wybierz przepis"
        isOpened={isOpened}
        close={close}
        isUncloseable={createMutation.isPending}
      >
        <div className={"mb-8 flex flex-col gap-3"}>
          {createMutation.isPending && (
            <p className="w-full text-center">Ładowanie...</p>
          )}
          {!createMutation.isError &&
            recipes.map(({ title, id }) => (
              <button
                onClick={() => handleClick({ id })}
                disabled={createMutation.isPending}
                className={`w-full cursor-pointer ${
                  createMutation.isPending
                    ? "cursor-progress"
                    : "cursor-pointer"
                }`}
              >
                <div className=" flex w-full  flex-col items-center justify-between rounded-md border-2 border-zinc-200 bg-zinc-50 px-3 py-3 transition-all ease-in-out hover:bg-white hover:shadow-md md:flex-row">
                  <h3 className=" text-lg text-zinc-700 ">{title}</h3>
                </div>
              </button>
            ))}

          {createMutation.isError && (
            <p className="w-full text-center text-red-500">
              Doszło do problemu podczas dodawania składników przepisu. Odśwież
              stronę i spróbuj ponownie
            </p>
          )}
        </div>
      </Modal>
    </>
  );
};
