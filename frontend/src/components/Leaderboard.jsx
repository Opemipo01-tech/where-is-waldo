function Leaderboard({ scores }) {
  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);

    const minutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  if (scores.length === 0) {
    return (
      <section className="leaderboard">
        <h2>Leaderboard</h2>
        <p>No scores yet.</p>
      </section>
    );
  }

  return (
    <section className="leaderboard">
      <h2>Leaderboard</h2>

      <ol>
        {scores.map((score) => (
          <li key={score.id}>
            <span>{score.name}</span>

            <span>{formatTime(score.time)}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default Leaderboard;
