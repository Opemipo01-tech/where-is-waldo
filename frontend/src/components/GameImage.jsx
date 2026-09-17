import beachImg from "../assets/waldo.png";
import { useRef } from "react";

function GameImage() {

    const imageRef = useRef(null);

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
     
    }

  return (
    <div className="image-container">
      <img
        ref={imageRef}
        src={beachImg}
        alt="Where's Waldo game"
        className="game-image"
        onClick={handleImageClick}
      />
    </div>
  );
}

export default GameImage;
