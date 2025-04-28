import { Router } from "express";

import {
    allowBoth,
    isAdmin,
    isAuthenticated,
} from "../middlewares/auth.middleware";
import {
    addComment,
    addReply,
    getComments,
    getReplyList,
    removeComment,
    softDelete,
    updateComment,
} from "../controllers/comment.controller";

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

protectedRouter.use(isAdmin).route("/soft").delete(softDelete);

// public routes to view comments & replies
router.get("/", allowBoth, getComments);
router.get("/reply", allowBoth, getReplyList);

router.use(protectedRouter);
export default router;
