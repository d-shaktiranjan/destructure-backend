import { Router } from "express";

import { allowBoth } from "../middlewares/auth.middleware";
import { getBlogDetails, getBlogList } from "../controllers/blog.controller";

const router = Router();
router.use(allowBoth);

router.get("/", getBlogList);
router.get("/:slug", getBlogDetails);

export default router;
