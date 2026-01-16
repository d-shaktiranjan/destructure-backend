import { Router } from "express";

import {
    addComment,
    addReply,
    getComments,
    getReplyList,
    removeComment,
    updateComment,
} from "../controllers/comment.controller";
import { allowBoth, isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

// protected routes to interact with comments & replies
const protectedRouter = Router();
protectedRouter.use(isAuthenticated);
protectedRouter
    .route("/")
    .post(addComment)
    .delete(removeComment)
    .put(updateComment);
protectedRouter.post("/reply", addReply);

// public routes to view comments & replies
router.get("/", allowBoth, getComments);
router.get("/reply", allowBoth, getReplyList);

router.use(protectedRouter);
export default router;
