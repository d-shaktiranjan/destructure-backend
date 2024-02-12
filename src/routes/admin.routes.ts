import { Router } from "express";
import {
    createBlog,
    getBlogDetailsAdmin,
    getBlogListAdmin,
    imageUpload,
    updateBlog,
} from "../controllers/blog.controller";

// middleware imports
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middlewares";

const router = Router();
router.use(isAuthenticated, isAdmin);

// blog routes
const blogRouter = Router();
blogRouter.post("/create", createBlog);
blogRouter.get("/", getBlogListAdmin);
blogRouter.put("/update", updateBlog);
blogRouter.get("/:slug", getBlogDetailsAdmin);
blogRouter.post("/image-upload", upload.single("image"), imageUpload);

// route usages
router.use("/blogs", blogRouter);

export default router;
