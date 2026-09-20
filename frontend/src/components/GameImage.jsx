import { useRef, useState } from "react";
import beachImage from "../assets/waldo.png";

import {
  submitGuess,
  completeGame,
  createScore,
  getScores,
} from "../services/gameApi";

import Leaderboard from "./LeaderBoard";

function GameImage({ gameId }) {
  const imageRef = useRef(null);

  const [targetBox, setTargetBox] = useState(null);

  const [foundCharacters, setFoundCharacters] =
    useState([]);

  const [markers, setMarkers] = useState([]);

  const [message, setMessage] = useState("");

  const [submittingGuess, setSubmittingGuess] =
    useState(false);

  const [gameComplete, setGameComplete] =
    useState(false);

  const [completionTime, setCompletionTime] =
    useState(null);

  const [playerName, setPlayerName] =
    useState("");

  const [submittingScore, setSubmittingScore] =
    useState(false);

  const [scoreSubmitted, setScoreSubmitted] =
    useState(false);

  const [scores, setScores] = useState([]);

  const [loadingScores, setLoadingScores] =
    useState(false);

  const characters = ["Waldo", "Wizard", "Odlaw"];

  function handleImageClick(event) {
    if (gameComplete) {
      return;
    }

    if (submittingGuess) {
      return;
    }

    const image = imageRef.current;

    const rect = image.getBoundingClientRect();

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const originalWidth = 1024;
    const originalHeight = 768;

    const scaleX = originalWidth / rect.width;
    const scaleY = originalHeight / rect.height;

    const originalX = clickX * scaleX;
    const originalY = clickY * scaleY;

    const boxSize = 120;

    let boxX = clickX - boxSize / 2;
    let boxY = clickY - boxSize / 2;

    boxX = Math.max(
      0,
      Math.min(boxX, rect.width - boxSize)
    );

    boxY = Math.max(
      0,
      Math.min(boxY, rect.height - boxSize)
    );

    setTargetBox({
      x: boxX,
      y: boxY,
      originalX,
      originalY,
    });

    setMessage("");
  }

  async function handleCharacterSelect(character) {
    if (!targetBox || submittingGuess || gameComplete) {
      return;
    }

    if (foundCharacters.includes(character)) {
      setMessage(`${character} has already been found.`);

      setTargetBox(null);

      return;
    }

    try {
      setSubmittingGuess(true);

      const result = await submitGuess(
        gameId,
        character,
        targetBox.originalX,
        targetBox.originalY
      );

      setTargetBox(null);

      if (result.correct) {
        setFoundCharacters((current) => {
          if (current.includes(character)) {
            return current;
          }

          return [...current, character];
        });

        setMarkers((current) => {
          const alreadyMarked = current.some(
            (marker) =>
              marker.character === character
          );

          if (alreadyMarked) {
            return current;
          }

          return [
            ...current,
            {
              character,
              originalX: targetBox.originalX,
              originalY: targetBox.originalY,
            },
          ];
        });

        const newFoundCount =
          foundCharacters.length + 1;

        if (newFoundCount === characters.length) {
          try {
            const completedGame =
              await completeGame(gameId);

            setGameComplete(true);

            setCompletionTime(
              completedGame.time
            );

            setMessage(
              "✓ You found everyone!"
            );
          } catch (error) {
            console.error(
              "Failed to complete game:",
              error
            );

            setMessage(
              "All characters found, but we couldn't complete the game."
            );
          }
        } else {
          setMessage(
            `✓ ${character} found!`
          );
        }
      } else {
        setMessage(
          "✗ Wrong character/location"
        );
      }
    } catch (error) {
      console.error(
        "Failed to submit guess:",
        error
      );

      setTargetBox(null);

      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setSubmittingGuess(false);
    }
  }

  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(
      milliseconds / 1000
    );

    const minutes = Math.floor(
      totalSeconds / 60
    );

    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  async function handleScoreSubmit(event) {
    event.preventDefault();

    const trimmedName = playerName.trim();

    if (!trimmedName) {
      setMessage("Please enter your name.");

      return;
    }

    try {
      setSubmittingScore(true);

      await createScore(
        trimmedName,
        gameId
      );

      setScoreSubmitted(true);

      setMessage("✓ Score saved!");

      await loadScores();
    } catch (error) {
      console.error(
        "Failed to save score:",
        error
      );

      setMessage(
        "Failed to save your score. Please try again."
      );
    } finally {
      setSubmittingScore(false);
    }
  }

  async function loadScores() {
    try {
      setLoadingScores(true);

      const data = await getScores();

      setScores(data);
    } catch (error) {
      console.error(
        "Failed to load scores:",
        error
      );

      setMessage(
        "Score saved, but the leaderboard could not be loaded."
      );
    } finally {
      setLoadingScores(false);
    }
  }

  return (
    <div className="image-container">
      <div className="image-wrapper">
        <img
          ref={imageRef}
          src={beachImage}
          alt="Where's Waldo game"
          className="game-image"
          onClick={handleImageClick}
        />

        {markers.map((marker) => (
          <div
            key={marker.character}
            className="correct-marker"
            style={{
              left: `${
                (marker.originalX / 1024) * 100
              }%`,

              top: `${
                (marker.originalY / 768) * 100
              }%`,
            }}
            title={`${marker.character} found`}
          />
        ))}

        {targetBox && (
          <div
            className="target-box"
            style={{
              left: `${targetBox.x}px`,
              top: `${targetBox.y}px`,
            }}
          >
            {characters.map((character) => (
              <button
                key={character}
                onClick={() =>
                  handleCharacterSelect(
                    character
                  )
                }
                disabled={submittingGuess}
              >
                {character}
              </button>
            ))}
          </div>
        )}
      </div>

      {message && (
        <p className="game-message">
          {message}
        </p>
      )}

      <div className="found-characters">
        <p>
          Found: {foundCharacters.length}/
          {characters.length}
        </p>
      </div>

      {gameComplete && (
        <div className="game-complete">
          <h2>Game Complete!</h2>

          {completionTime !== null && (
            <p>
              Your time:{" "}
              <strong>
                {formatTime(completionTime)}
              </strong>
            </p>
          )}

          {!scoreSubmitted && (
            <form
              className="score-form"
              onSubmit={handleScoreSubmit}
            >
              <label htmlFor="player-name">
                Enter your name
              </label>

              <input
                id="player-name"
                type="text"
                value={playerName}
                onChange={(event) =>
                  setPlayerName(
                    event.target.value
                  )
                }
                placeholder="Your name"
                maxLength={30}
                disabled={submittingScore}
              />

              <button
                type="submit"
                disabled={submittingScore}
              >
                {submittingScore
                  ? "Saving..."
                  : "Save Score"}
              </button>
            </form>
          )}

          {scoreSubmitted && (
            <div className="score-saved">
              <p>
                Your score has been saved!
              </p>

              {loadingScores ? (
                <p>Loading leaderboard...</p>
              ) : (
                <Leaderboard
                  scores={scores}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GameImage;
