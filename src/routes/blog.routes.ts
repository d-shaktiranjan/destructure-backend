import { Router } from "express";

import { getBlogDetails, getBlogList } from "../controllers/blog.controller";

const router = Router();

router.get("/", getBlogList);
router.get("/:slug", getBlogDetails);

export default router;
