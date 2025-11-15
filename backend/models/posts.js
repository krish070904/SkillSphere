import mongoose from "mongoose";
import commentSchema from "../models/comments.js";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],

    comments: [commentSchema], // array of subdocuments
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
