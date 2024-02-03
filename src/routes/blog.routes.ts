import { Router } from "express";

import {
    createBlog,
    getBlogDetails,
    getBlogList,
} from "../controllers/blog.controller";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.post("/create", isAuthenticated, isAdmin, createBlog);
router.get("/get-all-blogs", getBlogList);
router.get("/get-blog-details", getBlogDetails);

export default router;
