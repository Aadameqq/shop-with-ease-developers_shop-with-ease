import { useSession } from "next-auth/react";
import { Loading } from "./Loading";

export const AuthRequired = ({ children }) => {
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <Loading />;
  }
  return children;
};
