import { Router } from "express";
import { EquationController } from "../../controllers/docxiq/equation.controller";

const router = Router();

// Equation parsing and analysis
router.post("/parse", EquationController.parseEquation);

// Equation format conversion
router.post("/convert", EquationController.convertEquation);
router.post("/batch-convert", EquationController.batchConvertEquations);

// Equation solving and simplification
router.post("/solve", EquationController.solveEquation);
router.post("/simplify", EquationController.simplifyEquation);

// Equation validation
router.post("/validate", EquationController.validateEquation);

export { router as EquationRouter };
