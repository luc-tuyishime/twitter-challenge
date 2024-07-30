import { Router } from "express";
import RecommendationController from "../../controllers/recommendation";
import errorHandlerAsync from "../../middlewares/errorHandler";

const router = Router();

router.get("/", errorHandlerAsync(RecommendationController.getRecommendations));

export default router;
