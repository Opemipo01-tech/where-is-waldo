import express from "express";
import gameRoutes from "./routes/gameRoutes.js";
import scoreRouter from "./routes/scoreRoutes.js";

const app = express();

app.use(express.json());

app.use("/api",gameRoutes);
app.use("/api",scoreRouter);


const PORT = 3000;

app.listen(PORT,() => {
  console.log("Running");
})
