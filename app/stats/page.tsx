import StatsDisplay from "./_components/stats-display";

export const dynamicParams = false;

async function getStats() {
  try {
    const response = await fetch(process.env.BASE_URL + "/api/stats");

    if (!response.ok) {
      console.error("Failed to fetch, status:", response.status);

      return {
        gamesPlayed: [],
        correctGuesses: [],
        highScores: [],
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      gamesPlayed: [],
      correctGuesses: [],
      highScores: [],
    };
  }
}

export default async function StatsPage() {
  const stats = await getStats();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <StatsDisplay stats={stats} />
    </main>
  );
}
