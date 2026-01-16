import { Router } from "express";

import { allowBoth, isAuthenticated } from "../middlewares/auth.middleware";
import zodValidator from "../middlewares/zodValidator.middleware";

import { getReactions, reaction } from "../controllers/reaction.controller";
import { reactionSchema } from "../schemas/reaction.schema";

const router = Router();

router.post("/", isAuthenticated, zodValidator(reactionSchema), reaction);

router.route("/:blog").get(allowBoth, getReactions);

export default router;
