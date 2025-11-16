import User from "../models/users.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Post from "../models/posts.js";

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, skills } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !skills ||
      !Array.isArray(skills) ||
      skills.length === 0
    ) {
      return res.status(400).json({ message: "All fields required" });
    }
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(400).json({ message: "User exists" });
    }
    const user = await User.create({ name, email, password, skills });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Get user's posts and populate creator
    const posts = await Post.find({ createdBy: userId })
      .populate("createdBy", "name email")
      .populate("comments.user", "name email")
      .lean();

    const formattedPosts = posts.map((eachPost) => ({
      _id: eachPost._id,
      title: eachPost.title,
      description: eachPost.description,
      category: eachPost.category,
      createdBy: {
        name: eachPost.createdBy?.name,
        email: eachPost.createdBy?.email,
      },
      likeCount: eachPost.likes?.length || 0,
      commentCount: eachPost.comments?.length || 0,
      createdAt: eachPost.createdAt,
    }));

    const isFollowing = req.user ? user.followers.includes(req.user.id) : false;

    res.json({ user, posts: formattedPosts, isFollowing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const targetUser = await User.findById(userId);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const isFollowing = targetUser.followers.includes(req.user.id);

    if (isFollowing) {
      // Unfollow
      targetUser.followers.pull(req.user.id);
      currentUser.following.pull(userId);
    } else {
      // Follow
      targetUser.followers.push(req.user.id);
      currentUser.following.push(userId);
    }

    await targetUser.save();
    await currentUser.save();

    res.json({ isFollowing: !isFollowing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
