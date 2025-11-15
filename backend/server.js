console.clear();
console.log("♻️ Restarting server...");
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
dotenv.config();

const app = express();


app.use(express.json())
app.use(morgan("dev"));

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
