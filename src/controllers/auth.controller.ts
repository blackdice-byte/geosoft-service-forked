import { NextFunction, Request, Response } from "express";
import { oauth2Client } from "../services/google.service";
import { createResponse } from "../helpers/response";
import APIError from "../helpers/api.error";
import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export class AuthController {
  public static async initGOAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent",
      });
      res.json(
        createResponse({
          status: 200,
          success: true,
          message: "Auth URL generated",
          data: { authUrl },
        })
      );
    } catch (error) {
      next(error);
    }
  }

  public static async GOCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { code } = req.query;

      if (!code || typeof code !== "string") {
        throw new APIError({
          message: "Authorization code is required",
          status: 400,
        });
      }

      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });

      const { data: googleUser } = await oauth2.userinfo.get();

      if (!googleUser.email || !googleUser.id) {
        throw new APIError({
          message: "Failed to get user info from Google",
          status: 400,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}
