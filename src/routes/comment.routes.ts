import { Router } from "express";

import { isAuthenticated } from "../middlewares/auth.middleware";
import { addComment, removeComment } from "../controllers/comment.controller";

const router = Router();
router.use(isAuthenticated);

router.post("/add", addComment);
router.delete("/remove", removeComment);

export default router;
