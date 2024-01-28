import { Router } from "express";

import { createBlog, getBlogList } from "../controllers/blog.controller";

const router = Router();

router.post("/create", createBlog);
router.get("/get-all-blogs", getBlogList);

export default router;
