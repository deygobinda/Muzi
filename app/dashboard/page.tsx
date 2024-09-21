"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  ThumbsUp,
  ThumbsDown,
  Play,
  Pause,
  SkipForward,
} from "lucide-react";
import axios from "axios";
import Image from "next/image";

interface Song {
  userId: string;
  url: string;
  id: string;
  smallImg: string;
  bigImg: string;
  title: string;
  type: string;
  votes: number;
  haveUpvoted : boolean;
}


const REFRESH_INTERVAL = 10 * 1000;

export default function SongVotingQueue() {
  const [inputUrl, setInputUrl] = useState("");
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function refresh() {
    try {
      const res = await axios.get("/api/streams/my", {
        withCredentials: true,
      });
      setQueue(res.data.streams);
    } catch (error) {
      console.error("Error refreshing streams:", error);
    }
  }

  useEffect(() => {
    refresh();
    const intervalId = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  const sortedQueue = useMemo(
    () => [...queue].sort((a, b) => b.votes - a.votes),
    [queue]
  );

  useEffect(() => {
    if (currentlyPlaying && audioRef.current) {
      audioRef.current.src = `https://www.youtube.com/embed/${currentlyPlaying.id}?autoplay=1&controls=0&showinfo=0&autohide=1&modestbranding=1&loop=1`;
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.error("Error playing audio:", e));
      }
    }
  }, [currentlyPlaying, isPlaying]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/streams", {
        url: inputUrl,
      });
      setInputUrl("");
      setError(null);
      refresh();
    } catch (e) {
      console.error("Error adding music:", e);
      setError("Failed to add song. Please try again.");
    }
  };

  async function handleVote(id: string, voteType: 'up' | 'down') {
    try {
      const res = await axios.post(`api/streams/${voteType}vote`, {
        streamId: id,
      });

      if (res.data.message === "success") {

        
        setQueue(queue.map(song => {
          if (song.id === id) {
            return { 
              ...song, 
              votes: song.votes + (voteType === 'up' ? 1 : -1) 
            };
          }
          return song;
        }));
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  }

  const handlePlay = (song: Song) => {
    setCurrentlyPlaying(song);
    setQueue(queue.filter((s) => s.id !== song.id));
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
    }
  };

  const handleSkip = () => {
    if (sortedQueue.length > 0) {
      handlePlay(sortedQueue[0]);
    } else {
      setCurrentlyPlaying(null);
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <main className="flex-1">
        {/* Header section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-purple-400">
                  Song Voting Queue
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Vote for your favorite songs and listen to them in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Currently Playing section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-purple-400">
              Currently Playing
            </h2>
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                {currentlyPlaying ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <Image
                        src={currentlyPlaying.bigImg}
                        alt="Thumbnail"
                        width={300}
                        height={300}
                        className="rounded"
                      />
                      <div>
                        <p className="font-semibold text-purple-400">
                          {currentlyPlaying.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={togglePlayPause}
                        aria-label={isPlaying ? "Pause" : "Play"}
                        className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-gray-900"
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleSkip}
                        aria-label="Skip"
                        className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-gray-900"
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">No song playing</p>
                )}
              </CardContent>
            </Card>
            <audio ref={audioRef} className="hidden" />
          </div>
        </section>

        {/* Add to Queue section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-purple-400">
              Add to Queue
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 max-w-md mx-auto"
            >
              <Input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter YouTube URL"
                className="flex-1 bg-gray-800 border-gray-700 text-gray-100"
                aria-label="YouTube URL input"
              />
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Add to Queue
              </Button>
            </form>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </div>
        </section>

        {/* Upcoming Songs section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-purple-400">
              Upcoming Songs
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedQueue.map((song) => (
                <Card key={song.id} className="bg-gray-900 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Image src={song.smallImg} alt="Thumbnail" width={200} height={200} className="rounded"/>
                      <h3 className="font-semibold text-purple-400 text-center">
                        {song.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVote(song.id, 'up')}
                          aria-label={`Upvote ${song.title}`}
                          className={
                           song.haveUpvoted ? "border-purple-400 bg-purple-400 text-gray-900"
                              : "border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-gray-900"
                          }
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span className="text-xs">{song.votes}</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVote(song.id, 'down')}
                          aria-label={`Downvote ${song.title}`}
                          className={"border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-gray-900" }
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePlay(song)}
                          aria-label={`Play ${song.title}`}
                          className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-gray-900"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">
          © 2024 SongVote Inc. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a
            className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-purple-400"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-purple-400"
            href="#"
          >
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
}