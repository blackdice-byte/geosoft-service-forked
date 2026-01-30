import { Request, Response, NextFunction } from "express";
import APIError from "../../helpers/api.error";
import { createResponse } from "../../helpers/response";
import { search } from "../../services/gemini.service";
import { getAppApiKey, AppType } from "../../helpers/prompt";

export class EquationController {
  // Parse equation from text/image
  public static async parseEquation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { equation, inputFormat = "text" } = req.body;

      if (!equation) {
        throw new APIError({
          status: 400,
          message: "equation is required",
          isPublic: true,
        });
      }

      const prompt = `Parse and analyze the following mathematical equation:

Input Format: ${inputFormat}
Equation: ${equation}

Please provide:
1. The equation in standard mathematical notation
2. Identify all variables and constants
3. Equation type (linear, quadratic, differential, etc.)
4. Any special mathematical functions or operators used

Format your response as JSON with: notation, variables, constants, type, functions`;

      const apiKey = getAppApiKey(AppType.DOCXIQ);
      const response = await search({ prompt, apiKey });

      return res.status(200).json(
        createResponse({
          status: 200,
          success: true,
          message: "Equation parsed successfully",
          data: {
            parsed: response.text || "",
            inputFormat,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Convert equation between formats
  public static async convertEquation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { equation, sourceFormat, targetFormat } = req.body;

      if (!equation || !sourceFormat || !targetFormat) {
        throw new APIError({
          status: 400,
          message: "equation, sourceFormat, and targetFormat are required",
          isPublic: true,
        });
      }

      if (sourceFormat === targetFormat) {
        throw new APIError({
          status: 400,
          message: "Source and target formats must be different",
          isPublic: true,
        });
      }

      const formatNames: Record<string, string> = {
        latex: "LaTeX",
        mathml: "MathML",
        asciimath: "AsciiMath",
        unicode: "Unicode Math",
        plaintext: "Plain Text",
      };

      const prompt = `Convert the following mathematical equation from ${formatNames[sourceFormat] || sourceFormat} format to ${formatNames[targetFormat] || targetFormat} format.

Source Format: ${formatNames[sourceFormat] || sourceFormat}
Equation: ${equation}

Please provide ONLY the converted equation in ${formatNames[targetFormat] || targetFormat} format, nothing else.`;

      const apiKey = getAppApiKey(AppType.DOCXIQ);
      const response = await search({ prompt, apiKey });

      return res.status(200).json(
        createResponse({
          status: 200,
          success: true,
          message: "Equation converted successfully",
          data: {
            originalEquation: equation,
            convertedEquation: response.text || "",
            sourceFormat,
            targetFormat,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Solve equation
  public static async solveEquation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { equation, solveFor, showSteps = true } = req.body;

      if (!equation) {
        throw new APIError({
          status: 400,
          message: "equation is required",
          isPublic: true,
        });
      }

      let prompt = `Solve the following mathematical equation:

Equation: ${equation}`;

      if (solveFor) {
        prompt += `\nSolve for: ${solveFor}`;
      }

      if (showSteps) {
        prompt += `\n\nPlease provide:
1. The solution(s)
2. Step-by-step working
3. Verification of the solution(s)
4. Any special conditions or constraints`;
      } else {
        prompt += `\n\nProvide only the final solution(s).`;
      }

      const apiKey = getAppApiKey(AppType.DOCXIQ);
      const response = await search({ prompt, apiKey });

      return res.status(200).json(
        createResponse({
          status: 200,
          success: true,
          message: "Equation solved successfully",
          data: {
            equation,
            solution: response.text || "",
            solveFor,
            showSteps,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Simplify equation
  public static async simplifyEquation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { equation, showSteps = true } = req.body;

      if (!equation) {
        throw new APIError({
          status: 400,
          message: "equation is required",
          isPublic: true,
        });
      }

      const prompt = `Simplify the following mathematical equation or expression:

Equation: ${equation}

${showSteps ? "Please show all simplification steps and explain each transformation." : "Provide only the simplified form."}`;

      const apiKey = getAppApiKey(AppType.DOCXIQ);
      const response = await search({ prompt, apiKey });

      return res.status(200).json(
        createResponse({
          status: 200,
          success: true,
          message: "Equation simplified successfully",
          data: {
            originalEquation: equation,
            simplifiedEquation: response.text || "",
            showSteps,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Batch convert equations
  public static async batchConvertEquations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { equations, sourceFormat, targetFormat } = req.body;

      if (!equations || !Array.isArray(equations) || equations.length === 0) {
        throw new APIError({
          status: 400,
          message: "equations array is required and must not be empty",
          isPublic: true,
        });
      }

      if (!sourceFormat || !targetFormat) {
        throw new APIError({
          status: 400,
          message: "sourceFormat and targetFormat are required",
          isPublic: true,
        });
      }

      if (sourceFormat === targetFormat) {
        throw new APIError({
          status: 400,
          message: "Source and target formats must be different",
          isPublic: true,
        });
      }

      const formatNames: Record<string, string> = {
        latex: "LaTeX",
        mathml: "MathML",
        asciimath: "AsciiMath",
        unicode: "Unicode Math",
        plaintext: "Plain Text",
      };

      const prompt = `Convert the following mathematical equations from ${formatNames[sourceFormat] || sourceFormat} format to ${formatNames[targetFormat] || targetFormat} format.

Source Format: ${formatNames[sourceFormat] || sourceFormat}
Equations:
${equations.map((eq: string, idx: number) => `${idx + 1}. ${eq}`).join("\n")}

Please convert each equation to ${formatNames[targetFormat] || targetFormat} format. Maintain the same order. Output ONLY the converted equations, one per line, with no additional text or explanations.`;

      const apiKey = getAppApiKey(AppType.DOCXIQ);
      const response = await search({ prompt, apiKey });

      return res.status(200).json(
        createResponse({
          status: 200,
          success: true,
          message: "Equations converted successfully",
          data: {
            convertedEquations: response.text || "",
            sourceFormat,
            targetFormat,
            count: equations.length,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Validate equation syntax
  public static async validateEquation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { equation, format = "latex" } = req.body;

      if (!equation) {
        throw new APIError({
          status: 400,
          message: "equation is required",
          isPublic: true,
        });
      }

      const formatNames: Record<string, string> = {
        latex: "LaTeX",
        mathml: "MathML",
        asciimath: "AsciiMath",
      };

      const prompt = `Validate the syntax of the following mathematical equation in ${formatNames[format] || format} format:

Equation: ${equation}

Please provide:
1. Is the syntax valid? (yes/no)
2. If invalid, list all syntax errors
3. Suggestions for correction
4. The corrected equation (if applicable)

Format your response as JSON with: isValid, errors, suggestions, correctedEquation`;

      const apiKey = getAppApiKey(AppType.DOCXIQ);
      const response = await search({ prompt, apiKey });

      return res.status(200).json(
        createResponse({
          status: 200,
          success: true,
          message: "Equation validated successfully",
          data: {
            equation,
            format,
            validation: response.text || "",
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }
}
