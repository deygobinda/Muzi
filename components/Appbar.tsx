'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Headphones } from "lucide-react"
import Link from "next/link"

export default function Appbar() {
  const { data: session } = useSession()

  return (
    <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800">
      <Link href="/" className="flex items-center space-x-2">
        <Headphones className="h-6 w-6 text-purple-500" />
        <span className="text-2xl font-bold text-purple-400">Muzi</span>
      </Link>
      <div className="flex items-center space-x-4">
        {session?.user ? (
          <>
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={() => signOut()}
            >
              Logout
            </Button>
            <Avatar className="h-8 w-8 bg-purple-600">
              <AvatarFallback className="text-white">
                {session.user.name ? session.user.name[0].toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
          </>
        ) : (
          <Button
            variant="default"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => signIn()}
          >
            Sign In
          </Button>
        )}
      </div>
    </div>
  )
}