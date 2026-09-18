import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../modules/user/User";
import type {} from "../types/express";

const secret = process.env.JWT_SECRET || "food_delivery_secret";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Authorization token is required",
    });
  }

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    if (typeof decoded.id !== "string") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findById(decoded.id).select("_id role status");

    if (!user || user.status !== "ACTIVE") {
      return res.status(401).json({
        success: false,
        message: "User is not active",
      });
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
