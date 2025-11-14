
import mongoose from 'mongoose';
import bcrypt from "bcrypt";


const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,  // must be provided
  },
  email: {
    type: String,
    unique: true,     // no two users can have the same email
    required: true,
  },
  password: {
    type: String,   
    minlength: 6, 
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]

 
});

userSchema.pre('save', async function(next) {
  try {
    
    if (!this.isModified('password')) return next();
    
   
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    next(); 
  } catch (error) {
    next(error); 
  }
});
export default mongoose.model("User", userSchema);
