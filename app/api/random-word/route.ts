import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.API_NINJAS_KEY || "";

    const response = await fetch("https://api.api-ninjas.com/v1/randomword", {
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch random word");
    }

    const data = await response.json();

    return NextResponse.json({ word: data.word });
  } catch (error) {
    console.error("Error fetching random word:", error);
    return NextResponse.json(
      { error: "Failed to fetch random word" },
      { status: 500 }
    );
  }
}
