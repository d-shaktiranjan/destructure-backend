import { Router } from "express";
import {
    createBlog,
    getBlogDetailsAdmin,
    getBlogListAdmin,
} from "../controllers/blog.controller";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.post("/blogs/create", isAuthenticated, isAdmin, createBlog);
router.get("/blogs", isAuthenticated, isAdmin, getBlogListAdmin);
router.get("/blogs/:slug", isAuthenticated, isAdmin, getBlogDetailsAdmin);

export default router;
