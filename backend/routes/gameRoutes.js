import { Router } from "express";
import { createGame,submitGuess,completeGame } from "../controller/gameController.js";

const gameRouter = Router();

gameRouter.post("/games", createGame);
gameRouter.post("/games/:id/guess", submitGuess)
gameRouter.post("/games/:id/complete",completeGame);

export default gameRouter;
