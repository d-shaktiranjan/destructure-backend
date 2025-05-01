import { Router } from "express";
import {
    checkUniqueSlug,
    createBlog,
    generateSlug,
    getBlogListAdmin,
    updateBlog,
} from "../controllers/blog.controller";
import { imageList, imageUpload } from "../controllers/images.controller";

// middleware imports
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middlewares";
import zodValidator from "../middlewares/zodValidator.middleware";
import { blogCreateSchema, blogUpdateSchema } from "../schemas/blog.schema";
import {
    addAdmin,
    getAdminList,
    removeAdmin,
} from "../controllers/admin.controller";

const router = Router();
router.use(isAuthenticated, isAdmin);

// admin routes
router.route("/").get(getAdminList).post(addAdmin).delete(removeAdmin);

// blog routes
router
    .route("/blog")
    .post(zodValidator(blogCreateSchema), createBlog)
    .get(getBlogListAdmin)
    .put(zodValidator(blogUpdateSchema), updateBlog);

// blog slug routes
router.get("/slug/check", checkUniqueSlug);
router.get("/slug/generate", generateSlug);

// image routes
router
    .route("/images")
    .get(imageList)
    .post(upload.array("images"), imageUpload);

export default router;
