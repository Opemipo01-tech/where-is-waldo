import express from "express";
import gameRoutes from "./routes/gameRoutes.js";

const app = express();

app.use(express.json());

app.use("/api",gameRoutes);

app.get("/",(req,res) => {
  res.json({
    start:"Hello",
  })
})

const PORT = 3000;

app.listen(PORT,() => {
  console.log("Running");
})
