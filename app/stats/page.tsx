import StatsDisplay from "./_components/stats-display";

export const dynamicParams = false;

async function getStats() {
  try {
    const response = await fetch(process.env.BASE_URL + "/api/stats");

    if (!response.ok) {
      console.error("Failed to fetch, status:", response.status);
      return { notFound: true }; // Or handle the error as needed
    }

    const data = await response.json();

    // Return the fetched data as props to the page
    return {
      props: { stats: data }, // This will be passed to the StatsPage component
    };
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
