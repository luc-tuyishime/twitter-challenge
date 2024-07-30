import { Router } from "express";
import ETLController from "../../controllers/ETL";
import errorHandlerAsync from "../../middlewares/errorHandler";

const router = Router();

router.post("/perform", errorHandlerAsync(ETLController.performETL));

export default router;
