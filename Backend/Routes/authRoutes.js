import express from "express";
import { signup , loginUser,  forgotPassword,resetPassword } from "../Controller/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login",loginUser );

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;