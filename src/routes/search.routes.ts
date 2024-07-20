import { Router } from "express";
import { allowBoth, isAuthenticated } from "../middlewares/auth.middleware";
import {
    deleteSearchHistory,
    getSearchHistory,
    search,
    linkBlogInSearch,
} from "../controllers/search.controller";

const router = Router();
router.use(allowBoth);

router.route("/").get(search);

router
    .use(isAuthenticated)
    .route("/history")
    .get(getSearchHistory)
    .delete(deleteSearchHistory)
    .patch(linkBlogInSearch);

export default router;
