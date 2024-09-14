"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Appbar() {
  const session = useSession();
  return (
    <div className="flex justify-between p-4 border-b">
      <div className="flex flex-col justify-center text-3xl font-bold">
        Muzi
      </div>
      <div className="flex gap-3 ">
        {session.data?.user && (
          <button
            className="m-2 px-4 py-2 bg-black text-white rounded-md"
            onClick={() => signOut()}
          >
            Logout
          </button>
        )}
        {!session.data?.user && (
          <button
            className="m-2 px-4 py-2 bg-black text-white rounded-md"
            onClick={() => signIn()}
          >
            Singin
          </button>
        )}
        {session.data?.user && (
          <button className="m-2 px-4 py-2 bg-black text-white rounded-full">
            {session.data.user.name?.[0]}
          </button>
        )}
      </div>
    </div>
  );
}
