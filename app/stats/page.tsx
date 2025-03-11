import StatsDisplay from "./_components/stats-display";

export const dynamicParams = false;

async function getStats() {
  const response = await fetch(process.env.BASE_URL + "/api/stats");
  const data = await response.json();
  return data;
}

export default async function StatsPage() {
  const stats = await getStats();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <StatsDisplay stats={stats} />
    </main>
  );
}
