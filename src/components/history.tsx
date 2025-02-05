"use client";

import { FeatherIcon, InfoIcon } from "./icons";
import { useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import cx from "classnames";
import { useParams, usePathname } from "next/navigation";
import { Chat } from "@/db/schema";
import { fetcher } from "@/utils/functions";

export const History = () => {
  const { id } = useParams();
  const pathname = usePathname();

  const {
    data: history,
    error,
    isLoading,
    mutate,
  } = useSWR<Array<Chat>>("/api/history", fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    mutate();
  }, [pathname, mutate]);

  return (
    <div className="w-80 h-screen flex flex-col bg-neutral-800 z-20">
      <div className="p-3 flex-shrink-0">
        <div className="text-sm flex flex-row items-center justify-between">
          <div className="flex flex-row gap-2">
            <div className="dark:text-zinc-300">History</div>
            <div className="dark:text-zinc-500 text-zinc-500">
              {history === undefined ? "loading" : history.length} chats
            </div>
          </div>

          <Link
            href="/"
            className="bg-zinc-700 text-gray-100 hover:dark:bg-zinc-600 hover:bg-zinc-200 p-1.5 rounded-md cursor-pointer"
          >
            <FeatherIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 p-3 pt-0">
        {error && error.status === 401 ? (
          <div className="text-zinc-500 h-full w-full flex flex-row justify-center items-center text-sm gap-2">
            <InfoIcon />
            <div>Login to save and revisit previous chats!</div>
          </div>
        ) : null}

        {!isLoading && history?.length === 0 && !error ? (
          <div className="text-zinc-500 h-full w-full flex flex-row justify-center items-center text-sm gap-2">
            <InfoIcon />
            <div>No chats found</div>
          </div>
        ) : null}

        {isLoading && !error ? (
          <div className="flex flex-col w-full">
            {[44, 32, 28, 52].map((item) => (
              <div key={item} className="p-2 border-b dark:border-zinc-700">
                <div
                  className="h-[20px] bg-zinc-200 dark:bg-zinc-600 animate-pulse"
                  style={{ width: `${item}%` }}
                />
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col">
          {history &&
            history.map((chat) => (
              <Link
                href={`/${chat.id}`}
                key={chat.id}
                className={cx(
                  "p-2 dark:text-zinc-400 border-b dark:border-zinc-700 text-sm dark:hover:bg-zinc-700 hover:bg-zinc-200 last-of-type:border-b-0",
                  {
                    "dark:bg-zinc-700 bg-zinc-200": id === chat.id,
                  }
                )}
              >
                <div className="truncate">
                  {chat.messages[0].content as string}
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
