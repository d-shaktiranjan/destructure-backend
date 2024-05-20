import { Router } from "express";

import { allowBoth, isAuthenticated } from "../middlewares/auth.middleware";
import {
    addComment,
    addReply,
    getComments,
    getReplyList,
    removeComment,
    updateComment,
} from "../controllers/comment.controller";

const router = Router();

const protectedRouter = Router();
protectedRouter.use(isAuthenticated);

protectedRouter
    .route("/")
    .post(addComment)
    .delete(removeComment)
    .put(updateComment);
protectedRouter.post("/reply", addReply);

router.get("/", allowBoth, getComments);
router.get("/reply", allowBoth, getReplyList);

router.use(protectedRouter);
export default router;
