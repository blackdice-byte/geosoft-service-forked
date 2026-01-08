import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.get("/google", AuthController.initGOAuth);

router.get("/google/callback", AuthController.GOCallback);

export { router as AuthRouter };
