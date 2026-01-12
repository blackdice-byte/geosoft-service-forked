import { model, Schema } from "mongoose";
import { AppSource } from "../interfaces/user";

export interface IVisit {
  appSource: AppSource;
  path: string;
  visitReferrer?: string;
  userAgent?: string;
  ip?: string;
  userId?: Schema.Types.ObjectId;
  sessionId?: string;
  country?: string;
  city?: string;
}

export interface IVisitDocument extends IVisit, Document {
  createdAt: Date;
}

const visitSchema = new Schema<IVisitDocument>(
  {
    appSource: {
      type: String,
      enum: Object.values(AppSource),
      required: true,
    },
    path: { type: String, required: true },
    visitReferrer: { type: String },
    userAgent: { type: String },
    ip: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    sessionId: { type: String },
    country: { type: String },
    city: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

visitSchema.index({ appSource: 1, createdAt: -1 });
visitSchema.index({ createdAt: -1 });

export const Visit = model<IVisitDocument>("visit", visitSchema);
