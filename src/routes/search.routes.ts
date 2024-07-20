import { Router } from "express";
import { allowBoth, isAuthenticated } from "../middlewares/auth.middleware";
import { getSearchHistory, search } from "../controllers/search.controller";

const router = Router();
router.use(allowBoth);

router.route("/").get(search);

router.use(isAuthenticated).route("/history").get(getSearchHistory);

export default router;
