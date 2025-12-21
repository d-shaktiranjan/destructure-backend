import { Router } from "express";
import {
    googleCallback,
    googleLogin,
    logout,
    profile,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.get("/login", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/profile", isAuthenticated, profile);
router.post("/logout", isAuthenticated, logout);

export default router;
