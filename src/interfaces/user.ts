import { Document } from "mongoose";

export enum AppSource {
  TIMETABLELY = "timetablely",
  DOCXIQ = "docxiq",
  LINKSHYFT = "linkshyft",
}

export enum AuthProvider {
  LOCAL = "local",
  GOOGLE = "google",
  BOTH = "both",
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser {
  email: string;
  role?: UserRole;
  avatar?: string;
  username: string;
  lastLogin?: Date;
  lastname?: string;
  password?: string;
  googleId?: string;
  firstname?: string;
  isEmailVerified?: boolean;
  authProvider?: AuthProvider;
  // Multi-app support
  appSource: AppSource;
  registeredApps?: AppSource[];
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(userPassword: string): Promise<boolean>;
}
