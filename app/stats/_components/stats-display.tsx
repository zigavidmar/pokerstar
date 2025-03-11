"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/classname-utils";
import { containerVariants, itemVariants } from "@/lib/motion-variants";

interface StatsUser {
  userId: string;
  username: string;
  result: string;
}

interface Stats {
  gamesPlayed: StatsUser[];
  correctGuesses: StatsUser[];
  highScores: StatsUser[];
}

export default function StatsDisplay({ stats }: { stats: Stats }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-2/3 flex flex-col justify-center items-center gap-10"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-center text-primary">
          Player Statistics
        </h1>
      </motion.div>
      <div className="grid grid-cols-3 gap-10 w-full">
        <StatSection
          title="Games Played"
          users={stats.gamesPlayed}
        ></StatSection>
        <StatSection
          title="Correct Guesses"
          users={stats.correctGuesses}
        ></StatSection>
        <StatSection title="High Scores" users={stats.highScores}></StatSection>
      </div>

      <div className="w-full max-w-[400px] flex flex-col space-y-2">
        <motion.div variants={itemVariants} className="w-full">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatSection({ title, users }: { title: string; users: StatsUser[] }) {
  return (
    <Card className="border-0 bg-slate-800/50 backdrop-blur-sm text-white shadow-xl">
      <CardHeader>
        <motion.div variants={itemVariants}>
          <CardTitle className="text-xl font-bold text-center text-primary">
            {title}
          </CardTitle>
        </motion.div>
      </CardHeader>
      <CardContent className="space-y-6">
        {users.length > 0 ? (
          users.map(({ userId, username, result }, index) => (
            <motion.div
              key={userId}
              variants={itemVariants}
              className="flex items-center gap-5 justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-300">{index + 1}.</span>
                <p className="text-xl font-bold">{username}</p>
              </div>
              <p className="text-slate-300 font-bold">{result}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-slate-400 text-center">No games played yet</p>
        )}
      </CardContent>
    </Card>
  );
}
