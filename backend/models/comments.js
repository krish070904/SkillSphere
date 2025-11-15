import mongoose from 'mongoose';
import User from "../models/users.js"

const { Schema } = mongoose;


const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true },
  
}, { timestamps: true });

export default commentSchema;
