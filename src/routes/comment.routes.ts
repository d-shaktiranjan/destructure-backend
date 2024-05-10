import { Router } from "express";

import { isAuthenticated } from "../middlewares/auth.middleware";
import {
    addComment,
    removeComment,
    updateComment,
} from "../controllers/comment.controller";

const router = Router();
router.use(isAuthenticated);

router.route("/").post(addComment).delete(removeComment).put(updateComment);

export default router;
