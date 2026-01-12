import { NextFunction, Request, Response } from "express";
import { createResponse } from "../helpers/response";
import APIError from "../helpers/api.error";
import { Visit } from "../models/visit.model";
import { AppSource } from "../interfaces/user";

export class AnalyticsController {
  public static async trackVisit(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { appSource, path, referrer, sessionId } = req.body;

      if (!appSource || !Object.values(AppSource).includes(appSource)) {
        throw new APIError({
          message: "Valid appSource is required",
          status: 400,
        });
      }

      if (!path) {
        throw new APIError({
          message: "Path is required",
          status: 400,
        });
      }

      const visit = await Visit.create({
        appSource,
        path,
        visitReferrer: referrer || req.get("referer"),
        userAgent: req.get("user-agent"),
        ip: req.ip || req.socket.remoteAddress,
        sessionId,
      });

      res.status(201).json(
        createResponse({
          status: 201,
          success: true,
          message: "Visit tracked",
          data: { id: visit._id },
        })
      );
    } catch (error) {
      next(error);
    }
  }

  public static async getStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { appSource } = req.query;
      const { startDate, endDate } = req.query;

      const filter: Record<string, unknown> = {};

      if (
        appSource &&
        Object.values(AppSource).includes(appSource as AppSource)
      ) {
        filter.appSource = appSource;
      }

      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) {
          (filter.createdAt as Record<string, Date>).$gte = new Date(
            startDate as string
          );
        }
        if (endDate) {
          (filter.createdAt as Record<string, Date>).$lte = new Date(
            endDate as string
          );
        }
      }

      const [totalVisits, visitsByApp, visitsByPath] = await Promise.all([
        Visit.countDocuments(filter),
        Visit.aggregate([
          { $match: filter },
          { $group: { _id: "$appSource", count: { $sum: 1 } } },
        ]),
        Visit.aggregate([
          { $match: filter },
          {
            $group: {
              _id: { app: "$appSource", path: "$path" },
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 20 },
        ]),
      ]);

      res.json(
        createResponse({
          status: 200,
          success: true,
          message: "Analytics retrieved",
          data: {
            totalVisits,
            visitsByApp,
            visitsByPath,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }
}
