"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { cn } from "@/lib/classname-utils";
import { useRouter } from "next/navigation";
import { useUser } from "@/store/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { Button, buttonVariants } from "@/components/ui/button";

export default function StartGame() {
  const router = useRouter();
  const user = useUser();
  const [username, setUsername] = React.useState("");
  const [error, setError] = React.useState("");
  const [isUserInitialized, setIsUserInitialized] = React.useState(false);

  function createUser() {
    if (!username) {
      setError("Please choose a nickname before starting the game.");
      return;
    }

    const userId = `${Date.now()}-${Math.random()}`;
    useUser.setState({ id: userId, username });
    router.push("/game");
  }

  useEffect(() => {
    setIsUserInitialized(true);
  }, [user.id]);

  if (!isUserInitialized) {
    return <Skeleton className="w-full h-9 bg-primary/90" />;
  }

  function renderView() {
    if (!user.id) {
      return (
        <div className="flex flex-col items-center w-full">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="border border-primary/20 outline-none focus:border-primary/80 transition-colors rounded-md px-3 py-2 mb-4 w-full"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Button onClick={createUser} className="w-full">
            Start game
          </Button>
        </div>
      );
    }

    return (
      <Link href="/game" className={cn(buttonVariants(), "w-full")}>
        Start game
      </Link>
    );
  }

  return (
    <div className="flex flex-col space-y-2 w-full">
      {renderView()}
      <Link
        href="/stats"
        className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
      >
        View Stats
      </Link>
    </div>
  );
}
