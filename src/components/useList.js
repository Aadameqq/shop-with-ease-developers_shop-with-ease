import { useEffect, useRef, useState } from "react";

export const useList = (initial) => {
  const [products, setProducts] = useState(initial);

  const ref = useRef([]);

  useEffect(() => {
    return () => {
      ref.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  const addProduct = ({ content, id }) => {
    setProducts((prev) => [
      {
        id,
        content,
        isToggled: false,
        shouldAnimateRemoval: false,
        date: 0,
      },
      ...prev,
    ]);
  };

  const toggleProduct = ({ id }) => {
    setProducts((prev) =>
      prev.map((x) => (x.id === id ? { ...x, shouldAnimateRemoval: true } : x)),
    );
  };

  const removeProduct = ({ id }) => {
    setProducts((prev) => prev.filter((x) => x.id !== id));
  };

  return { products, toggleProduct, addProduct, removeProduct };
};
