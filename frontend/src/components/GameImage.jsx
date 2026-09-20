import { useEffect, useRef, useState } from "react";
import beachImage from "../assets/waldo.png";
import waldoHeadshot from "../assets/waldoImg.png";
import wizardHeadshot from "../assets/Headshot_-_Wizard.webp";
import odlawHeadshot from "../assets/Headshot_-_Odlaw.webp";
import { submitGuess, completeGame, createScore, getScores } from "../services/gameApi";
import LeaderBoard from "./LeaderBoard";

const characters = [{ name: "Waldo", image: waldoHeadshot }, { name: "Wizard", image: wizardHeadshot }, { name: "Odlaw", image: odlawHeadshot }];
const W = 1024, H = 768;

function GameImage({ gameId, onPlayAgain }) {
  const imageRef = useRef(null);
  const [target, setTarget] = useState(null), [found, setFound] = useState([]), [markers, setMarkers] = useState([]);
  const [message, setMessage] = useState(null), [checking, setChecking] = useState(false), [complete, setComplete] = useState(false), [time, setTime] = useState(null);
  const [name, setName] = useState(""), [saving, setSaving] = useState(false), [saved, setSaved] = useState(false), [scores, setScores] = useState([]), [loadingScores, setLoadingScores] = useState(false);
  const say = (text, type = "info") => setMessage({ text, type });
  const formatTime = (ms) => { const seconds = Math.floor(ms / 1000); return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; };
  useEffect(() => {
    async function loadLeaderboard() {
      try { setLoadingScores(true); setScores(await getScores()); }
      catch { say("The leaderboard couldn't be loaded right now.", "error"); }
      finally { setLoadingScores(false); }
    }
    loadLeaderboard();
  }, []);

  function handleImageClick(event) {
    if (complete || checking) return;
    const rect = imageRef.current.getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top, size = Math.min(154, rect.width * .42);
    setTarget({ x: Math.max(0, Math.min(x - size / 2, rect.width - size)), y: Math.max(0, Math.min(y - size / 2, rect.height - size)), originalX: x * W / rect.width, originalY: y * H / rect.height });
    setMessage(null);
  }
  async function handleCharacterSelect(character) {
    if (!target || checking || complete || found.includes(character)) return;
    const click = target;
    try {
      setChecking(true); const result = await submitGuess(gameId, character, click.originalX, click.originalY); setTarget(null);
      if (!result.correct) return say("Not quite — keep searching.", "error");
      const nextFound = [...found, character]; setFound(nextFound); setMarkers((current) => [...current, { character, originalX: click.originalX, originalY: click.originalY }]);
      if (nextFound.length !== characters.length) return say(`${character} found!`, "success");
      const game = await completeGame(gameId); setComplete(true); setTime(game.time); say("You found everyone!", "success");
    } catch { setTarget(null); say("Your guess couldn't be checked. Please try again.", "error"); }
    finally { setChecking(false); }
  }
  async function handleScoreSubmit(event) {
    event.preventDefault(); const player = name.trim(); if (!player) return say("Please enter a name before saving.", "error");
    try { setSaving(true); await createScore(player, gameId); setSaved(true); say("Score saved!", "success"); setLoadingScores(true); setScores(await getScores()); }
    catch { say("We couldn't save your score or load the leaderboard. Please try again.", "error"); }
    finally { setSaving(false); setLoadingScores(false); }
  }
  return <section className="game"><header className="game-header"><div><p className="eyebrow">The search is on</p><h1>Where&apos;s Waldo?</h1></div><b className="progress-pill">{found.length} / {characters.length} found</b></header><div className="character-roster">{characters.map(({ name: person, image }) => { const isFound = found.includes(person); return <div className={`character-card ${isFound ? "is-found" : ""}`} key={person}><span className="headshot-wrap"><img src={image} alt="" className="headshot" />{isFound && <i className="found-check">✓</i>}</span><b>{person}</b><small>{isFound ? "Found" : "Find me"}</small></div>; })}</div><p className="instruction">Click the illustration, then select the character at that spot.</p><div className="image-container"><div className="image-wrapper"><img ref={imageRef} src={beachImage} alt="Busy beach illustration with Waldo, Wizard and Odlaw" className="game-image" onClick={handleImageClick} />{markers.map((marker) => <span className="correct-marker" key={marker.character} style={{ left: `${marker.originalX / W * 100}%`, top: `${marker.originalY / H * 100}%` }} />)}{target && <div className="target-box" style={{ left: target.x, top: target.y }}><small>Who is this?</small>{characters.map(({ name: person }) => <button key={person} onClick={() => handleCharacterSelect(person)} disabled={checking || found.includes(person)}>{found.includes(person) ? `✓ ${person}` : person}</button>)}<button className="cancel-button" onClick={() => setTarget(null)} disabled={checking}>Cancel</button></div>}</div></div>{checking && <p className="loading-message">Checking your guess...</p>}{message && <p className={`notice notice-${message.type}`} role={message.type === "error" ? "alert" : "status"}>{message.type === "success" && "✓ "}{message.text}</p>}{complete && <section className="game-complete"><p className="eyebrow">Search complete</p><h2>You found the whole crew.</h2>{time !== null && <p>Your time <strong>{formatTime(time)}</strong></p>}{!saved ? <form className="score-form" onSubmit={handleScoreSubmit}><label htmlFor="name">Add your name to the leaderboard</label><div><input id="name" value={name} maxLength="30" placeholder="Your name" onChange={(event) => setName(event.target.value)} disabled={saving} /><button className="primary-button" disabled={saving}>{saving ? "Saving..." : "Save score"}</button></div></form> : <p className="notice notice-success">Your score has been saved.</p>}<button className="secondary-button" onClick={onPlayAgain}>Play again</button></section>}<section className="leaderboard-panel">{loadingScores ? <p className="loading-message">Loading leaderboard...</p> : <LeaderBoard scores={scores} />}</section></section>;
}
export default GameImage;


