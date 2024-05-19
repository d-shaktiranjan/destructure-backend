import { Router } from "express";

import { isAuthenticated } from "../middlewares/auth.middleware";
import {
    addComment,
    getComments,
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

router.get("/", getComments);

router.use(protectedRouter);
export default router;
