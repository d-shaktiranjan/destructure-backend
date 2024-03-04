import { Router } from "express";

import { isAuthenticated } from "../middlewares/auth.middleware";
import {
    getBlogDetails,
    getBlogList,
    reaction,
} from "../controllers/blog.controller";

const router = Router();

router.get("/", getBlogList);
router.get("/:slug", getBlogDetails);
router.post("/reaction", isAuthenticated, reaction);

export default router;
