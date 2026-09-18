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

    const distance = Math.sqrt(
      Math.pow(x - foundCharacter.x, 2) +
      Math.pow(y - foundCharacter.y, 2)
    );

    const correct = distance <= foundCharacter.tolerance;

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

