import { Router } from "express";

import { createBlog, getBlogList } from "../controllers/blog.controller";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.post("/create", isAuthenticated, isAdmin, createBlog);
router.get("/get-all-blogs", getBlogList);

export default router;
