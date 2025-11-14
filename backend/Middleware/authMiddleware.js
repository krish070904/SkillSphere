

import User from "../models/users.js";
import jwt from "jsonwebtoken";

console.log("authMiddleware loaded");

const protect = async(req, res, next) =>{
    let token;
    let decoded;
    if (req.headers.authorization?.startsWith("Bearer")) {
     token = req.headers.authorization.split(" ")[1];
    }
    else{
        return res.status(401).json({ message:"Bearer <token> format error"});
    }
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }
    catch(err){
        return res.status(401).json({ message: "Invalid or expired token"});
    }   
    req.user = await User.findById(decoded.id).select("-password");
    next();

}
export default protect;