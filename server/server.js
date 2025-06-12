import express from "express";
import dotenv from "dotenv";
import connectDb from "./configs/db.js";
import router from "./routes/curdRoute.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();
await connectDb();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use("/api/todo", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
