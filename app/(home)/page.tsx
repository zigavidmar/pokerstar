import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StartGame from "./_components/start-game";
import { DEFAULT_TIME_LEFT } from "../game/page";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 bg-slate-800/50 backdrop-blur-sm text-white shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            Guess the Cards
          </CardTitle>
          <CardDescription className="text-slate-300">
            Test your poker knowledge and reflexes!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-slate-300">
            You have {DEFAULT_TIME_LEFT} seconds to guess as many poker hands as
            possible. Each correct answer adds 5 seconds to your time.
          </p>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">How to play:</h3>
            <ul className="text-sm text-slate-300 text-left list-disc list-inside space-y-1">
              <li>5 cards will be dealt each round</li>
              <li>Choose the correct hand ranking from 3 options</li>
              <li>Answer correctly to gain more time</li>
              <li>Game ends when time runs out</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <StartGame />
        </CardFooter>
      </Card>
    </main>
  );
}
