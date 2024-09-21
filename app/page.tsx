import Redirect from "@/components/Redirect"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {Music, Radio, User } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
     <Redirect/>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-purple-400">
                  Your Music, Anywhere, Anytime
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Stream millions of songs, create playlists, and discover new artists. All for free.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
                <Button variant="outline" className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-gray-900">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-purple-400">
              Why Choose MusicStream?
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-700 p-4 rounded-lg bg-gray-900">
                <Music className="h-8 w-8 mb-2 text-purple-500" />
                <h3 className="text-xl font-bold text-purple-400">Millions of Songs</h3>
                <p className="text-sm text-gray-400 text-center">
                  Access a vast library of music from all genres and eras.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-700 p-4 rounded-lg bg-gray-900">
                <Radio className="h-8 w-8 mb-2 text-purple-500" />
                <h3 className="text-xl font-bold text-purple-400">Personalized Radio</h3>
                <p className="text-sm text-gray-400 text-center">
                  Enjoy custom radio stations based on your music taste.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-700 p-4 rounded-lg bg-gray-900">
                <User className="h-8 w-8 mb-2 text-purple-500" />
                <h3 className="text-xl font-bold text-purple-400">Social Sharing</h3>
                <p className="text-sm text-gray-400 text-center">
                  Share your favorite tracks and playlists with friends.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-purple-400">Start Listening Now</h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get unlimited access to millions of songs. No credit card required.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1 bg-gray-800 border-gray-700 text-gray-100" placeholder="Enter your email" type="email" />
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">Sign Up</Button>
                </form>
                <p className="text-xs text-gray-400">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2 hover:text-purple-400" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">© 2024 Muzi Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-purple-400" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-purple-400" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}