import Link from "next/link";

import { auth, signOut } from "@/app/(auth)/auth";

export const Navbar = async () => {
  const session = await auth();

  return (
    <div className="sticky top-0 bg-white border-b dark:border-zinc-800 py-2 px-3 justify-between flex flex-row items-center dark:bg-zinc-900">
      <div className="flex flex-row gap-3 items-center">
        <div className="dark:text-zinc-300">Mentor</div>
      </div>
      {session ? (
        <div className="group py-1 px-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer relative">
          <div className="text-sm dark:text-zinc-400 z-10">
            {session.user?.email}
          </div>
          <div className="flex-col absolute top-6 right-0 w-full pt-5 group-hover:flex hidden">
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="text-sm w-full p-1 rounded-md bg-red-500 text-red-50 hover:bg-red-600"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      ) : (
        <Link
          href={"login"}
          className="text-sm p-1 px-2 bg-zinc-900 rounded-md text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Login
        </Link>
      )}
    </div>
  );
};
