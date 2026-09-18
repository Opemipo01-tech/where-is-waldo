import { prisma } from "../prisma_db/prisma.js";

export async function createScore(req, res) {
  try {
    const { name, gameId } = req.body;

    if (!name || !gameId) {
      return res.status(400).json({
        error: "Name and gameId are required",
      });
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      },
    });

    if (!game) {
      return res.status(404).json({
        error: "Game not found",
      });
    }

    if (!game.completedAt) {
      return res.status(400).json({
        error: "Game has not been completed",
      });
    }

    const time = game.completedAt.getTime() - game.startedAt.getTime();

    const score = await prisma.score.create({
      data: {
        name,
        time,
        gameId,
      },
    });

    res.status(201).json(score);
  } catch (error) {
    console.error("Error creating score:", error);

    res.status(500).json({
      error: "Failed to create score",
    });
  }
}


export async function getScores(req, res) {
  try {
    const scores = await prisma.score.findMany({
      orderBy: {
        time: "asc",
      },
    });

    res.status(200).json(scores);
  } catch (error) {
    console.error("Error getting scores:", error);

    res.status(500).json({
      error: "Failed to get scores",
    });
  }
}

