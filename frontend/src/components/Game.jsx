import { useState } from "react";
import GameImage from "./GameImage";
import { startGame } from "../services/gameApi";

function Game() {
  const [gameId, setGameId] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState("");

  async function handleStartGame() {
    try {
      setIsStarting(true);
      setStartError("");
      setGameId((await startGame()).id);
    } catch {
      setStartError("We couldn't start a game. Check that the server is running, then try again.");
    } finally {
      setIsStarting(false);
    }
  }

  if (gameId) return <GameImage gameId={gameId} onPlayAgain={() => setGameId(null)} />;

  return (
    <section className="game game-start-screen">
      <div className="start-card">
        <p className="eyebrow">A beachside search</p>
        <h1>Where&apos;s Waldo?</h1>
        <p className="start-copy">Three familiar faces are hiding in the crowd. Click a spot, then choose who you think you found.</p>
        <button className="primary-button" onClick={handleStartGame} disabled={isStarting}>
          {isStarting ? "Preparing the search..." : "Start game"}
        </button>
        {startError && <p className="notice notice-error" role="alert">{startError}</p>}
      </div>
    </section>
  );
}

export default Game;
