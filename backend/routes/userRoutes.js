    
    import express from "express";
    import { registerUser, loginUser, getMe } from "../controllers/userControllers.js";
    import protect from "../Middleware/authMiddleware.js";
    const router = express.Router();

    router.post("/register", registerUser);

    router.post("/login", loginUser);

    router.get("/me", protect, getMe);

    export default router;
