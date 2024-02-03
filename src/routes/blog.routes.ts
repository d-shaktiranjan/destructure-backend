import { Router } from "express";

import {
    createBlog,
    getBlogDetails,
    getBlogDetailsAdmin,
    getBlogList,
} from "../controllers/blog.controller";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

// admin routes
router.post("/create", isAuthenticated, isAdmin, createBlog);
router.get(
    "/get-blog-details-admin",
    isAuthenticated,
    isAdmin,
    getBlogDetailsAdmin,
);

// user routes
router.get("/get-all-blogs", getBlogList);
router.get("/get-blog-details", getBlogDetails);

export default router;
