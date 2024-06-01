import { Router } from "express";
import { addSearchItem } from "../controllers/search.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();
router.use(isAuthenticated);

router.route("/").post(addSearchItem);

export default router;
