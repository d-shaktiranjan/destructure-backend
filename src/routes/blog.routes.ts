import { Router } from "express";

import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware";
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
router.get("/:slug", getBlogDetails);

export default router;
