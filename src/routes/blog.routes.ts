import { Router } from "express";

import { getBlogDetails, getBlogList } from "@/controllers/blog.controller";
import { addComment, getComments } from "@/controllers/comment.controller";
import { allowBoth, isAuthenticated } from "@/middlewares/auth.middleware";

const router = Router();
router.use(allowBoth);

router.get("/", getBlogList);
router.get("/:slug", getBlogDetails);

router
    .route("/:slug/comments")
    .get(getComments)
    .post(isAuthenticated, addComment);

export default router;
