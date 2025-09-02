import { Request, Response, NextFunction } from 'express';
import { ResponseService } from '../utils/response';
import { verifyToken } from '../utils/helper';

interface JwtPayload {
  id?: string;
  email?: string;
  role?: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
}

export interface IRequestUser extends Request {
  user?: JwtPayload;
  token?: string;
}

// Authentication middleware
export const authMiddleware = async (
  req: IRequestUser,
  res: Response,
  next: NextFunction,
): Promise<unknown> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return ResponseService({
        data: null,
        status: 401,
        success: false,
        message: 'Authentication token is missing',
        res,
      });
    }

    const user = (await verifyToken(token)) as JwtPayload;
    if (!user) {
      return ResponseService({
        data: null,
        status: 401,
        success: false,
        message: 'Invalid authentication token',
        res,
      });
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    const { message, stack } = error as Error;
    return ResponseService({
      data: { message, stack },
      status: 401,
      success: false,
      message: 'Invalid authentication token',
      res,
    });
  }
};
