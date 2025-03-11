import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const STATS_FILE = path.join(process.cwd(), "data", "stats.json");

interface Stats {
  [userId: string]: {
    username: string;
    highScore: number;
    totalGamesPlayed: number;
    games: {
      score: number;
      attempts: { correct: boolean; hand: string }[];
    }[];
  };
}

function getStats(): Stats {
  if (!fs.existsSync(STATS_FILE)) {
    return {};
  }

  const data = fs.readFileSync(STATS_FILE, "utf8");
  return JSON.parse(data);
}

function saveStats(stats: Stats) {
  const dir = path.dirname(STATS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
}

export async function GET() {
  // Delete stats file
  /* fs.unlinkSync(STATS_FILE);
  return NextResponse.json({ message: "Stats file deleted" });
 */
  const stats = getStats();

  let totalGamesPlayedArray = [];
  let totalCorrectGuessesArray = [];
  let highScoreArray = [];

  for (const [userId, userStats] of Object.entries(stats)) {
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
  const allStats = getStats();
  const myStats = allStats[user.id] || {};

  const myUpdatedGames = [...(myStats.games || []), stats];
  const myHighScore = getMyHighScore(myUpdatedGames);

  allStats[user.id] = {
    username: user.username,
    highScore: myHighScore,
    totalGamesPlayed: myUpdatedGames.length,
    games: myUpdatedGames,
  };
  saveStats(allStats);
  return NextResponse.json({ message: "Stats updated successfully" });
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
