import { Router } from "express";

import {
    addReply,
    getReplyList,
    removeComment,
    updateComment,
} from "../controllers/comment.controller";
import { allowBoth, isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router
    .route("/:_id")
    .patch(isAuthenticated, updateComment)
    .delete(isAuthenticated, removeComment);

router
    .route("/:_id/replies")
    .post(isAuthenticated, addReply)
    .get(allowBoth, getReplyList);

export default router;
