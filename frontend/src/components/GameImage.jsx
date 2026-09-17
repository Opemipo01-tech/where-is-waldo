import beachImg from "../assets/waldo.png";


function GameImage() {
  return (
    <div className="image-container">
      <img
        src={beachImg}
        alt="Where's Waldo game"
        className="game-image"
      />
    </div>
  );
}

export default GameImage;
