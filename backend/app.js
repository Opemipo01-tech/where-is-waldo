import express from "express";
import cors from "cors"
import gameRoutes from "./routes/gameRoutes.js";
import scoreRouter from "./routes/scoreRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://where-is-waldo-mu.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());

app.use("/api",gameRoutes);
app.use("/api",scoreRouter);


const PORT = 3000;

app.listen(PORT,() => {
  console.log("Running");
})
