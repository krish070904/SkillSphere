import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  getUserById,
  followUser,
} from "../controllers/userControllers.js";
import protect from "../Middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, getMe);

router.get("/:id", protect, getUserById);


router.post("/:id/follow", protect, followUser);

export default router;
