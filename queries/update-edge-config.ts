// Utility function to update Edge Config
export async function updateEdgeConfig(items: any[]) {
  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const vercelApiToken = process.env.VERCEL_API_TOKEN;

  const url = `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${vercelApiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log("Edge Config update successful:", result);
      return result;
    } else {
      console.error("Edge Config update failed:", result);
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error("Error updating Edge Config:", error);
    throw new Error("Error updating Edge Config");
  }
}
