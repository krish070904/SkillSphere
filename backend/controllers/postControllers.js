import dotenv from "dotenv";
import Post from "../models/posts.js";

dotenv.config();

export const createPost = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ message: "All credentials needed!!" });
    }
    const post = await Post.create({
      title,
      description,
      category,
      createdBy: req.user.id,
    });
    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email")
      .populate("comments.user", "name email");
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("comments.user", "name email");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const liked = post.likes.some((id) => id.toString() === req.user.id);

    if (liked) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    post.comments.push({
      user: req.user.id,
      text,
    });

    await post.save();
 
    const updated = await Post.findById(req.params.id).populate(
      "comments.user",
      "name email"
    );

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
