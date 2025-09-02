import { Response, NextFunction } from 'express';
import { ResponseService } from '../utils/response';
import { Role } from '../database/models/Role';
import { IRequestUser } from './authMiddleware';

export const checkRole =
  (roles: string[]) =>
  async (req: IRequestUser, res: Response, next: NextFunction): Promise<unknown> => {
    try {
      if (!req.user || !req.user.role) {
        return ResponseService({
          data: null,
          status: 403,
          success: false,
          message: 'Role information is missing',
          res,
        });
      }

      const userRole = await Role.findByPk(req.user.role);
      if (!userRole) {
        return ResponseService({
          data: null,
          status: 403,
          success: false,
          message: 'Invalid role',
          res,
        });
      }

      if (!roles.includes(userRole.name)) {
        return ResponseService({
          data: null,
          status: 403,
          success: false,
          message: 'You do not have the required role to perform this action',
          res,
        });
      }

      next();
    } catch (error) {
      const { message } = error as Error;
      return ResponseService({
        data: { message },
        status: 500,
        success: false,
        message: 'Error checking role permissions',
        res,
      });
    }
  };
