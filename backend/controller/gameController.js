import { prisma } from "../prisma_db/prisma.js";

export async function createGame(req, res) {
  try {
    const game = await prisma.game.create({
      data: {},
    });

    res.status(201).json({
      id: game.id,
      startedAt: game.startedAt,
    });
  } catch (error) {
    console.error("Error creating game:", error);

    res.status(500).json({
      error: "Failed to create game",
    });
  }
}

export async function submitGuess(req, res) {
    
  try {
    const { id } = req.params;
    const { character, x, y } = req.body;

    const foundCharacter = await prisma.character.findUnique({
      where: {
        name: character,
      },
    });
  
    if (!foundCharacter) {
      return res.status(404).json({
        error: "Character not found",
      });
    }


console.log("Character:", foundCharacter.name);
console.log("Stored coordinates:", {
  x: foundCharacter.x,
  y: foundCharacter.y,
});

console.log("Player click:", {
  x,
  y,
});

console.log("Tolerance:", foundCharacter.tolerance);

const distance = Math.sqrt(
  Math.pow(x - foundCharacter.x, 2) +
  Math.pow(y - foundCharacter.y, 2)
);

console.log("Distance:", distance);

const correct = distance <= foundCharacter.tolerance;

console.log("Correct:", correct);



    res.status(200).json({
      correct,
      character: foundCharacter.name,
    });
  } catch (error) {
    console.error("Error submitting guess:", error);

    res.status(500).json({
      error: "Failed to submit guess",
    });
  }
}

export async function completeGame(req, res) {
  try {
    const { id } = req.params;

    const game = await prisma.game.findUnique({
      where: {
        id,
      },
    });

    if (!game) {
      return res.status(404).json({
        error: "Game not found",
      });
    }

    if (game.completedAt) {
      return res.status(400).json({
        error: "Game has already been completed",
      });
    }

    const completedAt = new Date();

    const updatedGame = await prisma.game.update({
      where: {
        id,
      },
      data: {
        completedAt,
      },
    });

    const time = completedAt.getTime() - game.startedAt.getTime();

    res.status(200).json({
      id: updatedGame.id,
      startedAt: updatedGame.startedAt,
      completedAt: updatedGame.completedAt,
      time,
    });
  } catch (error) {
    console.error("Error completing game:", error);

    res.status(500).json({
      error: "Failed to complete game",
    });
  }
}