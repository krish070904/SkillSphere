import dotenv from "dotenv";
import Post from "../models/posts.js";
import User from "../models/users.js";

dotenv.config();

export const createPost = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !category) {
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
    const page = req.query.page;
    const limit = req.query.limit;
    let pageParsed = Math.max(1, Number(page) || 1);
    let limitParsed = Math.max(1, Number(limit) || 10);

    let skip = (pageParsed - 1) * limitParsed;
    if (skip < 0) {
      skip = 0;
    }

    let filter = {};
    const category = req.query.category;

    if (category) {
      const normalized = category.trim().toLowerCase();
      filter.category = new RegExp(`^${normalized}$`, "i");
    }
    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limitParsed);
    const hasNextPage = pageParsed < totalPages;

    const posts = await Post.find(filter)
      .skip(skip)
      .limit(limitParsed)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email")
      .populate("comments.user", "name email")
      .lean();

    if (posts.length === 0) {
      return res.json({
        page: pageParsed,
        limit: limitParsed,
        totalPosts,
        totalPages,
        hasNextPage: hasNextPage,
        data: [],
      });
    }
    const formatted = posts.map((eachPost) => {
      return {
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
      };
    });

    return res.json({
      page: pageParsed,
      limit: limitParsed,
      totalPosts: totalPosts,
      totalPages: totalPages,
      hasNextPage: hasNextPage,
      data: formatted,
    });
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
    if (!post) return res.status(404).json({ message: "Post not found" });
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
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Comment text required" });
    }

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
export const getFollowingFeed = async (req, res) => {
  try {
    let user;
    const userId = req.user.id;
    if (userId) {
      user = await User.findById(userId).select("following");
    } else {
      return res.status(404).json({ message: "User Id not found" });
    }
    if (!user) return res.status(404).json({ message: "User not found" });

    const followingIds = user.following || [];
    if (followingIds.length === 0) {
      return res.json({ message: "no follows" });
    }
    const posts = await Post.find({ createdBy: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email")
      .populate("comments.user", "name email")
      .lean();

    const formatted = posts.map((eachPost) => {
      return {
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
      };
    });
    return res.json(formatted);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
