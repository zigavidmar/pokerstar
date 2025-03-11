// Purpose: Share user game stats with the server.
export async function shareGameStats(
  user: {
    id: string;
    username: string;
  },
  stats: {
    score: number;
    attempts: { correct: boolean; hand: string }[];
  }
) {
  await fetch("/api/stats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user,
      stats,
    }),
  });
}
