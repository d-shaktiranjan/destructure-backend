import { Router } from "express";
import { allowBoth } from "../middlewares/auth.middleware";
import { search } from "../controllers/search.controller";

const router = Router();
router.use(allowBoth);

router.route("/").get(search);

export default router;
