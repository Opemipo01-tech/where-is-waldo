import { useRef, useState } from "react";
import beachImg from "../assets/waldo.png";

function GameImage() {
  const imageRef = useRef(null);

  const [targetBox, setTargetBox] = useState(null);
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [message, setMessage] = useState("");
  const [gameComplete, setGameComplete] = useState(false);

  const characters = ["Waldo", "Wizard", "Odlaw"];

  function handleImageClick(event) {
    // Don't allow more clicks after the game is complete
    if (gameComplete) {
      return;
    }

    const image = imageRef.current;

    const rect = image.getBoundingClientRect();

    // Calculate click position relative to the displayed image
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    console.log("Displayed coordinates:");
    console.log("x:", clickX);
    console.log("y:", clickY);

    // Original image dimensions
    const originalWidth = 1024;
    const originalHeight = 768;

    // Calculate the scale between displayed image and original image
    const scaleX = originalWidth / rect.width;
    const scaleY = originalHeight / rect.height;

    // Convert displayed coordinates to original image coordinates
    const originalX = clickX * scaleX;
    const originalY = clickY * scaleY;

    console.log("Original image coordinates:");
    console.log("x:", originalX);
    console.log("y:", originalY);

    // Targeting box size
    const boxSize = 120;

    // Put the box's top-left corner around the click
    let boxX = clickX - boxSize / 2;
    let boxY = clickY - boxSize / 2;

    // Prevent the box from going outside the image
    boxX = Math.max(0, Math.min(boxX, rect.width - boxSize));
    boxY = Math.max(0, Math.min(boxY, rect.height - boxSize));

    setTargetBox({
      x: boxX,
      y: boxY,
    });

    // Remove previous message when the player clicks again
    setMessage("");
  }

  function handleCharacterSelect(character) {
    console.log("Selected character:", character);

    // Remove the targeting box
    setTargetBox(null);

    // Don't allow selecting a character that has already been found
    if (foundCharacters.includes(character)) {
      setMessage(`${character} has already been found.`);
      return;
    }

    /*
      TEMPORARY FAKE VALIDATION

      For now, we are pretending that:

      Waldo  -> correct
      Wizard -> correct
      Odlaw  -> wrong

      This is ONLY for testing the frontend.

      Later, the backend will decide whether
      the character was actually clicked.
    */

    const fakeValidation = {
      Waldo: true,
      Wizard: true,
      Odlaw: true,
    };

    const isCorrect = fakeValidation[character];

    if (!isCorrect) {
      setMessage(`Wrong! You did not find ${character}.`);
      return;
    }

    // Character was correctly found
    setFoundCharacters((currentCharacters) => {
      const updatedCharacters = [...currentCharacters, character];

      // Check whether all characters have been found
      if (updatedCharacters.length === characters.length) {
        setGameComplete(true);
        setMessage("🎉 You found all the characters!");
      } else {
        setMessage(`Correct! You found ${character}.`);
      }

      return updatedCharacters;
    });
  }

  function handleCancel() {
    setTargetBox(null);
    setMessage("");
  }

  return (
    <div className="game-container">

      {/* Game feedback message */}
      {message && (
        <p className="game-message">
          {message}
        </p>
      )}

      <div className="image-container">

        {/* Game image */}
        <img
          ref={imageRef}
          src={beachImg}
          alt="Where's Waldo game"
          className="game-image"
          onClick={handleImageClick}
        />

        {/* Display markers for characters that have been found */}
        {foundCharacters.map((character) => (
          <div
            key={character}
            className={`character-marker ${character.toLowerCase()}`}
          >
            ✓ {character}
          </div>
        ))}

        {/* Display targeting box */}
        {targetBox && !gameComplete && (
          <div
            className="target-box"
            style={{
              left: `${targetBox.x}px`,
              top: `${targetBox.y}px`,
            }}
          >
            {/* Character selection buttons */}
            {characters.map((character) => (
              <button
                key={character}
                onClick={() => handleCharacterSelect(character)}
                disabled={foundCharacters.includes(character)}
              >
                {character}
              </button>
            ))}

            {/* Cancel button */}
            <button
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Found characters */}
      <div className="found-characters">
        <p>
          Found: {foundCharacters.length} / {characters.length}
        </p>

        {foundCharacters.length > 0 && (
          <ul>
            {foundCharacters.map((character) => (
              <li key={character}>
                {character}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Game complete message */}
      {gameComplete && (
        <div className="game-complete">
          <h2>Game Complete!</h2>
          <p>You found all the characters.</p>
        </div>
      )}
    </div>
  );
}

export default GameImage;





        // const clickX = event.clientX - rect.left; 
        // const clickY = event.clientY - rect.top; 

        // console.log("Displayed coordinates:"); 
        // console.log("x:", clickX); 
        // console.log("y:", clickY);


        // // Convert displayed coordinates to original image coordinates 
        // const originalWidth = 1024;
        //  const originalHeight = 768; 
         
        //  const scaleX = originalWidth / rect.width; 
        //  const scaleY = originalHeight / rect.height; 
         
        //  const originalX = clickX * scaleX;
        //   const originalY = clickY * scaleY; 
          
        //   console.log("Original image coordinates:"); 
        //   console.log("x:", originalX);
        //    console.log("y:", originalY);