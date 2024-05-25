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
} from "../controllers/blog.controller";

const router = Router();

router.get("/", allowBoth, getBlogList);
router.get("/author", isAuthenticated, isAdmin, coAuthorList);
router.get("/details", allowBoth, getBlogDetails);

export default router;
