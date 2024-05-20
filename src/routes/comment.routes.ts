import { Router } from "express";

import { allowBoth, isAuthenticated } from "../middlewares/auth.middleware";
import {
    addComment,
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

router.get("/", allowBoth, getComments);
router.get("/reply", allowBoth, getReplyList);

router.use(protectedRouter);
export default router;
