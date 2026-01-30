import { Router } from "express";
import { LanguageController } from "../../controllers/docxiq/language.controller";

const router = Router();

router.post("/translate", LanguageController.translateText);
router.post("/detect-language", LanguageController.detectLanguage);
router.get("/languages", LanguageController.getSupportedLanguages);
router.post("/batch-translate", LanguageController.batchTranslate);

export { router as LanguageRouter };
