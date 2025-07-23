import { Router } from "express";

import { getBlogDetails, getBlogList } from "../controllers/blog.controller";
import { allowBoth } from "../middlewares/auth.middleware";

const router = Router();
router.use(allowBoth);

router.get("/", getBlogList);
router.get("/:slug", getBlogDetails);

export default router;
