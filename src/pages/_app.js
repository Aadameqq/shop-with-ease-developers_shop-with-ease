import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import { Header } from "../components/Header";
import { AuthRequired } from "@/components/AuthRequired";
import { Rubik } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const font = Rubik({ subsets: ["latin"], weight: ["400", "500", "600"] });
const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <span className={font.className}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <Header />
          <div className="flex h-screen justify-center px-5 sm:px-10">
            {Component.requiresAuth ? (
              <AuthRequired>
                <Component {...pageProps} />
              </AuthRequired>
            ) : (
              <Component {...pageProps} />
            )}
          </div>
        </SessionProvider>
      </QueryClientProvider>
    </span>
  );
}
