import { useRef, useState } from "react";
import beachImage from "../assets/waldo.png";
import {
  submitGuess,
  completeGame,
} from "../services/gameApi";

function GameImage({ gameId }) {
  const imageRef = useRef(null);

  const [targetBox, setTargetBox] = useState(null);
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [message, setMessage] = useState("");
  const [submittingGuess, setSubmittingGuess] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [completionTime, setCompletionTime] = useState(null);

  const characters = ["Waldo", "Wizard", "Odlaw"];

  function handleImageClick(event) {
    // Do not allow clicks after the game is complete
    if (gameComplete) {
      return;
    }

    // Do not allow a new target while a guess is being submitted
    if (submittingGuess) {
      return;
    }

    const image = imageRef.current;
    const rect = image.getBoundingClientRect();

    // Coordinates relative to the displayed image
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Original image dimensions
    const originalWidth = 1024;
    const originalHeight = 768;

    // Convert displayed coordinates to original image coordinates
    const scaleX = originalWidth / rect.width;
    const scaleY = originalHeight / rect.height;

    const originalX = clickX * scaleX;
    const originalY = clickY * scaleY;

    // Targeting box size
    const boxSize = 120;

    // Keep targeting box inside the displayed image
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

    // Prevent selecting a character that has already been found
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

      // Remove targeting box
      setTargetBox(null);

      if (result.correct) {
        // Add character to found characters
        setFoundCharacters((current) => {
          if (current.includes(character)) {
            return current;
          }

          return [...current, character];
        });

        // Add marker only if this character does not already have one
        setMarkers((current) => {
          const alreadyMarked = current.some(
            (marker) => marker.character === character
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

        // Calculate what the new number of found characters will be
        const newFoundCount = foundCharacters.length + 1;

        if (newFoundCount === characters.length) {
          try {
            // Tell the backend that the game is complete
            const completedGame = await completeGame(gameId);

            setGameComplete(true);
            setCompletionTime(completedGame.time);
            setMessage("✓ You found everyone!");
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
          setMessage(`✓ ${character} found!`);
        }
      } else {
        setMessage("✗ Wrong character/location");
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

  return (
    <div className="image-container">

      {/* Image area */}
      <div className="image-wrapper">

        <img
          ref={imageRef}
          src={beachImage}
          alt="Where's Waldo game"
          className="game-image"
          onClick={handleImageClick}
        />

        {/* Successful guess markers */}
        {markers.map((marker) => (
          <div
            key={marker.character}
            className="correct-marker"
            style={{
              left: `${(marker.originalX / 1024) * 100}%`,
              top: `${(marker.originalY / 768) * 100}%`,
            }}
            title={`${marker.character} found`}
          />
        ))}

        {/* Targeting box */}
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
                  handleCharacterSelect(character)
                }
                disabled={submittingGuess}
              >
                {character}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Game message */}
      {message && (
        <p className="game-message">
          {message}
        </p>
      )}

      {/* Found characters */}
      <div className="found-characters">
        <p>
          Found: {foundCharacters.length} /{" "}
          {characters.length}
        </p>
      </div>

      {/* Completion information */}
      {gameComplete && (
        <div className="game-complete">
          <h2>Game Complete!</h2>

          {completionTime !== null && (
            <p>
              Your time:{" "}
              {(completionTime / 1000).toFixed(2)} seconds
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default GameImage;