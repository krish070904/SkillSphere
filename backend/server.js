console.clear();
console.log("♻️ Restarting server...");

import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import router from "./routes/"
dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan("dev"));

connectDB();
app.use('/api/v1', router);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
