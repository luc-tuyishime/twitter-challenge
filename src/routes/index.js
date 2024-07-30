import { Router } from "express";

import api from "./api";
import recommendations from "./recommendation";
import auth from "./auth";
import etl from "./ETL";

const router = Router();

router.use("/q2", recommendations);
router.use("/auth", auth);
router.use("/etl", etl);
router.use(api);

export default router;
