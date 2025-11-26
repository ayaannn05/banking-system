import express from "express";

import { signUp, signIn, signOut } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/signout", authMiddleware, signOut);

export default authRouter;
