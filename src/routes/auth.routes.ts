import { Router } from "express";
import {
    googleLogin,
    googleCallback,
    logout,
} from "../controllers/auth.controller";

const router = Router();

router.get("/login", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/logout", logout);

export default router;
