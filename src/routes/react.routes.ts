import { Router } from "express";

import { isAuthenticated } from "../middlewares/auth.middleware";
import zodValidator from "../middlewares/zodValidator.middleware";

import { reactionSchema } from "../schemas/reaction.schema";
import { reaction } from "../controllers/reaction.controller";

const router = Router();

router.post("/", isAuthenticated, zodValidator(reactionSchema), reaction);

export default router;
