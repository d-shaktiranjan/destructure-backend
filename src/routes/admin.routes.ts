import { Router } from "express";
import {
    createBlog,
    getBlogDetailsAdmin,
    getBlogListAdmin,
} from "../controllers/blog.controller";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();
router.use(isAuthenticated, isAdmin);

// blog routes
const blogRouter = Router();
blogRouter.post("/create", createBlog);
blogRouter.get("/", getBlogListAdmin);
blogRouter.get("/:slug", getBlogDetailsAdmin);

// route usages
router.use("/blogs", blogRouter);

export default router;
