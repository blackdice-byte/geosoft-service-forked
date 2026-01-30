import { NextFunction, Request, Response } from "express";
import { createResponse } from "../../helpers/response";
import APIError from "../../helpers/api.error";
import { translationService } from "../../services/translation.service";

export class LanguageController {
  public static async translateText(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { text, sourceLanguage, targetLanguage } = req.body;

      if (!text || typeof text !== "string") {
        throw new APIError({
          message: "Text is required and must be a string",
          status: 400,
        });
      }

      if (!sourceLanguage || typeof sourceLanguage !== "string") {
        throw new APIError({
          message: "Source language is required and must be a string",
          status: 400,
        });
      }

      if (!targetLanguage || typeof targetLanguage !== "string") {
        throw new APIError({
          message: "Target language is required and must be a string",
          status: 400,
        });
      }

      const translatedText = await translationService.translate(
        text,
        sourceLanguage,
        targetLanguage
      );

      res.json(
        createResponse({
          status: 200,
          success: true,
          message: "Text translated successfully",
          data: {
            originalText: text,
            translatedText,
            sourceLanguage,
            targetLanguage,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }

  public static async detectLanguage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { text } = req.body;

      if (!text || typeof text !== "string") {
        throw new APIError({
          message: "Text is required and must be a string",
          status: 400,
        });
      }

      const detectedLanguage = await translationService.detectLanguage(text);

      res.json(
        createResponse({
          status: 200,
          success: true,
          message: "Language detected successfully",
          data: {
            text,
            detectedLanguage,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }

  public static async getSupportedLanguages(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const languages = translationService.getSupportedLanguages();

      res.json(
        createResponse({
          status: 200,
          success: true,
          message: "Supported languages retrieved",
          data: languages,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  public static async batchTranslate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { texts, sourceLanguage, targetLanguage } = req.body;

      if (!texts || !Array.isArray(texts) || texts.length === 0) {
        throw new APIError({
          message: "Texts array is required and must not be empty",
          status: 400,
        });
      }

      if (!sourceLanguage || typeof sourceLanguage !== "string") {
        throw new APIError({
          message: "Source language is required and must be a string",
          status: 400,
        });
      }

      if (!targetLanguage || typeof targetLanguage !== "string") {
        throw new APIError({
          message: "Target language is required and must be a string",
          status: 400,
        });
      }

      const translations = await Promise.all(
        texts.map((text: string) =>
          translationService.translate(text, sourceLanguage, targetLanguage)
        )
      );

      res.json(
        createResponse({
          status: 200,
          success: true,
          message: "Batch translation completed successfully",
          data: {
            translations,
            sourceLanguage,
            targetLanguage,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }
}
