import express from "express";
import { createPost,getAllPost,getPostById,commentOnPost,likePost,getFollowingFeed } from "../controllers/postControllers.js";
import protect from "../Middleware/authMiddleware.js";
const router = express.Router();

router.post("/", protect,createPost);

router.get("/", getAllPost);

router.get("/feed", protect, getFollowingFeed);

router.get("/:id", getPostById);

router.post("/:id/like", protect, likePost);

router.post("/:id/comment", protect, commentOnPost);

export default router;
 