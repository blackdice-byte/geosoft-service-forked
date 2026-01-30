import { Router } from "express";
import { LanguageRouter } from "./language.route";
import { ResearchSupportRouter } from "./research.support.route";
import { EquationRouter } from "./equation.route";

const router = Router();

router.use("/language", LanguageRouter);
router.use("/research", ResearchSupportRouter);
router.use("/equation", EquationRouter);

export { router as DocxIQRouter };
