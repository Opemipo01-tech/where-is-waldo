import { Router } from "express";
import {
  createScore,
  getScores,
} from "../controller/scoreController.js";

const scoreRouter = Router();

scoreRouter.post("/scores", createScore);
scoreRouter.get("/scores", getScores);

export default scoreRouter;
