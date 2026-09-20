const API_URL = import.meta.env.VITE_API_URL;

export async function startGame() {
  const response = await fetch(`${API_URL}/games`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to start game");
  }

  return response.json();
}

export async function submitGuess(gameId, character, x, y) {
  const response = await fetch(
    `${API_URL}/games/${gameId}/guess`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        character,
        x,
        y,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to submit guess");
  }

  return response.json();
}

export async function completeGame(gameId) {
  const response = await fetch(
    `${API_URL}/games/${gameId}/complete`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to complete game");
  }

  return response.json();
}

export async function createScore(name, gameId) {
  const response = await fetch(`${API_URL}/scores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      gameId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save score");
  }

  return response.json();
}

export async function getScores() {
  const response = await fetch(`${API_URL}/scores`);

  if (!response.ok) {
    throw new Error("Failed to fetch scores");
  }

  return response.json();
}
