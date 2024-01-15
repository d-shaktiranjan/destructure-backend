import express from "express";
import {
    googleLogin,
    googleCallback,
    logout,
} from "../controllers/auth.controller";

const router = express.Router();

router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/logout", logout);

export default router;
