import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";

const router = Router();

router.get("/stats", AnalyticsController.getStats);
router.post("/visit", AnalyticsController.trackVisit);
router.get("/admin/dashboard", AnalyticsController.getAdminDashboard);

export { router as AnalyticsRouter };
