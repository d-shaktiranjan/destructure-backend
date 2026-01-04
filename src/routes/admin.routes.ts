import { Router } from "express";
import {
    checkUniqueSlug,
    createBlog,
    deleteBlog,
    generateSlug,
    getBlogListAdmin,
    updateBlog,
} from "../controllers/blog.controller";
import { mediaList, mediaUpload } from "../controllers/media.controller";

// middleware imports
import {
    addAdmin,
    getAdminList,
    removeAdmin,
} from "../controllers/admin.controller";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middlewares";
import zodValidator from "../middlewares/zodValidator.middleware";
import { adminAddSchema } from "../schemas/admin.schema";
import { blogCreateSchema, blogUpdateSchema } from "../schemas/blog.schema";

const router = Router();
router.use(isAuthenticated, isAdmin);

// admin routes
router
    .route("/")
    .get(getAdminList)
    .post(zodValidator(adminAddSchema), addAdmin)
    .delete(removeAdmin);

// blog routes
router
    .route("/blog")
    .post(zodValidator(blogCreateSchema), createBlog)
    .get(getBlogListAdmin);

router
    .route("/blog/:slug")
    .put(zodValidator(blogUpdateSchema), updateBlog)
    .delete(deleteBlog);

// blog slug routes
router.get("/slug/check", checkUniqueSlug);
router.get("/slug/generate", generateSlug);

// media routes
router.route("/media").get(mediaList).post(upload.array("media"), mediaUpload);

export default router;
