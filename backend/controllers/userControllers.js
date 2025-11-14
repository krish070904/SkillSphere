import User from "../models/users.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, skills } = req.body;
    if (!name || !email || !password || !skills || skills.length === 0) {
      return res.status(400).json({ message: "All fields required" });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User exists" });
    }
    const user = await User.create({ name, email, password, skills });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res
      .status(201)
      .json({
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign(
    { id: user._id }, 
    process.env.JWT_SECRET, 
    {expiresIn: "7d",}
    );


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
