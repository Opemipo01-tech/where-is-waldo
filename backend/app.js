import express from "express";
import cors from "cors"
import gameRoutes from "./routes/gameRoutes.js";
import scoreRouter from "./routes/scoreRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api",gameRoutes);
app.use("/api",scoreRouter);


const PORT = 3000;

app.listen(PORT,() => {
  console.log("Running");
})
