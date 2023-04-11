import express from "express";
const router = express.Router();
import { login as authController } from "../controllers/authController.js";

// Routes
router.get("/", authController);
router.post("/", authController);

export { router as auth };
