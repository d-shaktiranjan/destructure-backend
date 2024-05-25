import { isAuthenticated } from "../middlewares/auth.middleware";
import { reaction } from "../controllers/reaction.controller";
import { Router } from "express";

const router = Router();

router.post("/", isAuthenticated, reaction);

export default router;
