import beachImg from "../assets/waldo.png";
import { useRef,useState } from "react";

function GameImage() {
    
    const imageRef = useRef(null);
    
    const [targetBox, setTargetBox] = useState(null);
    
    function handleImageClick(event){

        const image = imageRef.current;

        const rect = image.getBoundingClientRect();

        const clickX = event.clientX - rect.left; 
        const clickY = event.clientY - rect.top; 

        console.log("Displayed coordinates:"); 
        console.log("x:", clickX); 
        console.log("y:", clickY);


        // Convert displayed coordinates to original image coordinates 
        const originalWidth = 1024;
         const originalHeight = 768; 
         
         const scaleX = originalWidth / rect.width; 
         const scaleY = originalHeight / rect.height; 
         
         const originalX = clickX * scaleX;
          const originalY = clickY * scaleY; 
          
          console.log("Original image coordinates:"); 
          console.log("x:", originalX);
           console.log("y:", originalY);
     
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
         }
       
         function handleCharacterSelect(character) {
           console.log("Selected character:", character);
       
           // Remove the targeting box
           setTargetBox(null);
         }

         function handleCancel() { setTargetBox(null); }
    

  return (
    <div className="image-container">
      <img
        ref={imageRef}
        src={beachImg}
        alt="Where's Waldo game"
        className="game-image"
        onClick={handleImageClick}
        />


        {targetBox && (
          <div
            className="target-box"
            style={{
              left: `${targetBox.x}px`,
              top: `${targetBox.y}px`,
            }}
          >
            <button onClick={() => handleCharacterSelect("Waldo")}>
              Waldo
            </button>
        
            <button onClick={() => handleCharacterSelect("Wizard")}>
              Wizard
            </button>
        
            <button onClick={() => handleCharacterSelect("Odlaw")}>
              Odlaw
            </button>

            <button className="cancel-button" onClick={handleCancel} > Cancel </button>
          </div>
        )}

    </div>
  );
}

export default GameImage;
