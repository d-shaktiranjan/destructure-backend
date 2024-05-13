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
    reaction,
} from "../controllers/blog.controller";

const router = Router();

router.get("/", getBlogList);
router.post("/reaction", isAuthenticated, reaction);
router.get("/author", isAuthenticated, isAdmin, coAuthorList);
router.get("/details", allowBoth, getBlogDetails);

export default router;
