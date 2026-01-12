import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";

const router = Router();

router.post("/visit", AnalyticsController.trackVisit);
router.get("/stats", AnalyticsController.getStats);

export { router as AnalyticsRouter };
