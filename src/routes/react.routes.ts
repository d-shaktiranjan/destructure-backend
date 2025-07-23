import { Router } from "express";

import { isAuthenticated } from "../middlewares/auth.middleware";
import zodValidator from "../middlewares/zodValidator.middleware";

import { reaction } from "../controllers/reaction.controller";
import { reactionSchema } from "../schemas/reaction.schema";

const router = Router();

router.post("/", isAuthenticated, zodValidator(reactionSchema), reaction);

export default router;
