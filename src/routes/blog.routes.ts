import { Router } from "express";

import {
    allowBoth,
    isAdmin,
    isAuthenticated,
} from "../middlewares/auth.middleware";
import {
    coAuthorList,
    getBlogDetails,
    getBlogList,
    blogStats,
} from "../controllers/blog.controller";

const router = Router();
router.use(allowBoth);

router.get("/", getBlogList);
router.get("/:slug", getBlogDetails);

router.get("/author", isAuthenticated, isAdmin, coAuthorList);
router.get("/stats", blogStats);

export default router;
