import { Request } from "express";

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
