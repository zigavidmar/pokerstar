import { NextResponse } from "next/server";
import { createClient } from "@vercel/edge-config";
import { updateEdgeConfig } from "@/queries/update-edge-config";

const client = createClient(process.env.EDGE_CONFIG); // Create the Edge Config client

export const runtime = "edge";

async function getStats() {
  return (
    (await client.get("stats")) || {
      gamesPlayed: [],
      correctGuesses: [],
      highScores: [],
    }
  );
}

export async function GET() {
  const stats = await getStats();

  let totalGamesPlayedArray = [];
  let totalCorrectGuessesArray = [];
  let highScoreArray = [];

  for (const [userId, userStats] of Object.entries(stats)) {
    if (!userStats.games) {
      continue;
    }
    const username = userStats.username;
    const totalGamesPlayed = userStats.totalGamesPlayed;
    const highScore = userStats.highScore;

    totalGamesPlayedArray.push({ userId, username, result: totalGamesPlayed });
    highScoreArray.push({ userId, username, result: highScore });

    const correctGuesses = userStats.games.reduce((total, game) => {
      return total + game.attempts.filter((attempt) => attempt.correct).length;
    }, 0);

    totalCorrectGuessesArray.push({ userId, username, result: correctGuesses });
  }

  totalGamesPlayedArray.sort((a, b) => b.result - a.result);
  totalCorrectGuessesArray.sort((a, b) => b.result - a.result);
  highScoreArray.sort((a, b) => b.result - a.result);

  return NextResponse.json({
    gamesPlayed: totalGamesPlayedArray,
    correctGuesses: totalCorrectGuessesArray,
    highScores: highScoreArray,
  });
}

export async function POST(request: Request) {
  const { user, stats } = (await request.json()) as {
    user: { id: string; username: string };
    stats: {
      score: number;
      attempts: { correct: boolean; hand: string }[];
    };
  };
  let allStats = await getStats();
  const myStats = allStats[user.id] || {};

  const myUpdatedGames = [...(myStats.games || []), stats];
  const myHighScore = getMyHighScore(myUpdatedGames);

  allStats[user.id] = {
    username: user.username,
    highScore: myHighScore,
    totalGamesPlayed: myUpdatedGames.length,
    games: myUpdatedGames,
  };

  // Prepare the payload for Edge Config update
  const items = [
    {
      operation: "upsert", // "upsert" means create or update
      key: "stats",
      value: allStats,
    },
  ];

  // Update Edge Config with the new stats
  const updateResult = await updateEdgeConfig(items);

  return NextResponse.json({
    message: "Stats updated successfully",
    updateResult,
  });
}

function getMyHighScore(
  userGames: {
    score: number;
    attempts: { correct: boolean; hand: string }[];
  }[]
) {
  if (userGames.length === 0) {
    return 0;
  }

  // Find the highest score
  return userGames.reduce((highScore, game) => {
    return Math.max(highScore, game.score);
  }, 0);
}
