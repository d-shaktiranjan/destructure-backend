import { Router } from "express";
import {
    googleLogin,
    googleCallback,
    profile,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.get("/login", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/profile", isAuthenticated, profile);

export default router;
