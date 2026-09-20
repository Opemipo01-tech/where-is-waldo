import { useEffect, useState } from "react";
import GameImage from "./GameImage";
import { startGame } from "../services/gameApi";

function Game() {
  const [gameId, setGameId] = useState(null);

  useEffect(() => {
    async function createGame() {
      try {
        const game = await startGame();

        setGameId(game.id);

        console.log("Game started:", game);
      } catch (error) {
        console.error(
          "Failed to start game:",
          error
        );
      }
    }

    createGame();
  }, []);

  return (
    <section className="game">
      <h1>Where's Waldo?</h1>

      {gameId ? (
        <GameImage gameId={gameId} />
      ) : (
        <p>Starting game...</p>
      )}
    </section>
  );
}

export default Game;