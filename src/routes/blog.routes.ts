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
    slugList,
} from "../controllers/blog.controller";

const router = Router();
router.use(allowBoth);

router.get("/", getBlogList);
router.get("/author", isAuthenticated, isAdmin, coAuthorList);
router.get("/details", getBlogDetails);
router.get("/stats", blogStats);
router.get("/slugs", slugList);

export default router;
