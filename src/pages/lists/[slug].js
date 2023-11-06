import { Product } from "@/components/Product";
import { useList } from "@/components/useList";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getServerSession } from "next-auth";
import { useEffect, useRef, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { db } from "@/utils/prismaClient";
import { ManageMembers } from "@/components/ManageMembers";
import { AddFromRecipe } from "@/components/AddFromRecipe";

export default function List({
  initialProducts,
  listId,
  listTitle,
  members,
  recipes,
}) {
  const [value, setValue] = useState("");

  const { products, addProduct, toggleProduct, removeProduct } =
    useList(initialProducts);

  const createMutation = useMutation({
    mutationFn: ({ content }) => {
      return axios.post(`/api/lists/${listId}/products/`, { content });
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ id }) => {
      return axios.delete(`/api/lists/${listId}/products/${id}`);
    },
  });

  const ref = useRef();

  const handleSubmit = async () => {
    const content = value;
    if (!content) return;

    try {
      const result = await createMutation.mutateAsync({ content });

      setValue("");

      await addProduct(result.data);
      setTimeout(() => {
        ref && ref.current && ref.current.focus();
      }, 10);
    } catch (err) {}
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleRemoveProduct = async ({ id }) => {
    try {
      await removeMutation.mutateAsync({ id });
      removeProduct({ id });
    } catch (err) {}
  };

  const [constantData, setConstantData] = useState([]);

  const query = useQuery({
    queryKey: ["hints", value],
    queryFn: async () => {
      const result = await axios.get(`/api/hints?q=${value}`);
      return result.data;
    },
    enabled: value.length > 2,
  });

  useEffect(() => {
    query.data && setConstantData(query.data);
  }, [query.data]);

  const hintsContainerRef = useRef();
  const submitBtnRef = useRef();

  const setPosition = () => {
    const position =
      ref.current.getBoundingClientRect().top + ref.current.offsetHeight;

    hintsContainerRef.current.style.top = `${position + 10}px`;
    hintsContainerRef.current.style.width = `${ref.current.offsetWidth}px`;
    if (document.body.offsetWidth <= 800) {
      hintsContainerRef.current.style.width = `${
        ref.current.offsetWidth + submitBtnRef.current.offsetWidth + 8
      }px`;
    }
    hintsContainerRef.current.style.left = `${
      ref.current.getBoundingClientRect().left
    }px`;
  };

  useEffect(() => {
    setPosition();

    window.addEventListener("resize", setPosition);
    return () => window.removeEventListener("resize", setPosition);
  }, []);

  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    if (value.length > 2) {
      setIsHidden(false);
    } else {
      setIsHidden(true);
      setConstantData([]);
    }
  }, [value]);

  const handleClick = async (value) => {
    await setValue(value);
    setIsHidden(true);
  };

  return (
    <>
      <div className="flex w-full  flex-col items-center">
        <div className="mt-40 flex h-full w-full max-w-[1000px] flex-col gap-3  ">
          <div className="mb-7 flex flex-col items-center justify-between md:flex-row">
            <h1 className="text-2xl">{listTitle}</h1>
            <div className="mt-7 flex w-full flex-col gap-3 md:mt-0 md:w-auto md:flex-row md:gap-2">
              <ManageMembers members={members} />
              <AddFromRecipe
                recipes={recipes}
                listId={listId}
                addProduct={addProduct}
              />
            </div>
          </div>
          <div className="mb-6 flex w-full max-w-[1000px] gap-2 pb-3">
            <input
              type="text"
              placeholder="Wpisz produkt"
              ref={ref}
              className={`w-full
              rounded-xl 
              bg-zinc-100
                p-3
              px-4
              shadow-md
              shadow-zinc-200
              transition-all ease-in-out placeholder:text-zinc-400 hover:bg-zinc-100
              ${createMutation.isPending && " cursor-progress"}
              ${createMutation.isError && " cursor-not-allowed"}
              `}
              onFocus={() => value.length > 2 && setIsHidden(false)}
              onBlur={(e) =>
                !e?.relatedTarget?.classList.contains("hint") &&
                setIsHidden(true)
              }
              disabled={createMutation.isPending || createMutation.isError}
              onKeyDown={handleKeyPress}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button
              className={`rounded-2xl bg-blue-500 px-8 py-3 text-white shadow-md shadow-zinc-400 ${
                createMutation.isPending && " cursor-progress bg-zinc-500"
              }  ${
                createMutation.isError && " cursor-not-allowed bg-zinc-500"
              }`}
              onClick={handleSubmit}
              disabled={createMutation.isPending || createMutation.isError}
              ref={submitBtnRef}
            >
              {"Dodaj"}
            </button>
          </div>
          {createMutation.isError && (
            <div
              className={`relative flex items-center justify-center rounded-xl bg-zinc-100 px-4  py-4 pl-4 shadow-md shadow-zinc-200 transition-all duration-300 ease-in-out`}
            >
              <p className={`text-center text-red-400`}>
                Doszło do problemu w trakcie dodawania produktu. Odśwież stronę
                i spróbuj ponownie
              </p>{" "}
            </div>
          )}
          {products.map(({ content, id, shouldAnimateRemoval }) => (
            <Product
              key={id}
              toggle={() => toggleProduct({ id })}
              content={content}
              shouldAnimateRemoval={shouldAnimateRemoval}
              remove={() => handleRemoveProduct({ id })}
            />
          ))}
        </div>
      </div>
      <div
        ref={hintsContainerRef}
        className={`absolute flex flex-col rounded-md bg-zinc-100 shadow-md shadow-zinc-200 ${
          isHidden && "hidden"
        }`}
      >
        {constantData &&
          constantData.map((hint, index) => (
            <button
              className={`hint break-all border-zinc-200 px-4 py-5 text-left text-zinc-700 ${
                index !== 0 && "border-t"
              }`}
              onClick={() => handleClick(hint)}
            >
              {hint}
            </button>
          ))}
      </div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { slug } = context.params;

  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  const found = await db.list.findUnique({
    where: { id: Number(slug), members: { some: { id: session.user.id } } },
    include: { members: true, products: true },
  });

  const recipes = await db.recipe.findMany({
    where: { owner: { id: session.user.id } },
    include: { owner: true },
  });

  if (!found)
    return {
      redirect: {
        destination: "/lists",
        permanent: false,
      },
    };

  return {
    props: {
      initialProducts: found.products.reverse(),
      listId: slug,
      listTitle: found.title,
      recipes,
      members: found.members.map(({ id, username, email }) => ({
        id,
        username,
        email,
      })),
    },
  };
};
