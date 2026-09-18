import { Router } from "express";
import { createGame,submitGuess } from "../controller/gameController.js";

const gameRouter = Router();

gameRouter.post("/games", createGame);
gameRouter.post("/games/:id/guess", submitGuess)

export default gameRouter;
