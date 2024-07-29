import { Router } from "express";
import {
    checkUniqueSlug,
    createBlog,
    generateSlug,
    getBlogListAdmin,
    imageUpload,
    updateBlog,
} from "../controllers/blog.controller";
import { imageList } from "../controllers/images.controller";

// middleware imports
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middlewares";

const router = Router();
router.use(isAuthenticated, isAdmin);

// blog routes
router.route("/blog").post(createBlog).get(getBlogListAdmin).put(updateBlog);

// blog slug routes
router.get("/slug/check", checkUniqueSlug);
router.get("/slug/generate", generateSlug);

router.post("/upload/image", upload.single("image"), imageUpload);
router.route("/images").get(imageList);

export default router;
