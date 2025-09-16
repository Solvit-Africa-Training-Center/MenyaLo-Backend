import { Response } from 'express';
import { Database } from '../../../database';
import { ResponseService } from '../../../utils/response';

export class UserService {
  data: UpdateCitizenInterface | UpdateOrganizationInterface;
  res: Response;

  constructor(data: UpdateCitizenInterface | UpdateOrganizationInterface, res: Response) {
    this.data = data;
    this.res = res;
  }

  async getAllUsers(): Promise<unknown> {
    try {
      const users = await Database.User.findAll();
      if (!users || users.length === 0) {
        ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Users not found',
          res: this.res,
        });
        return;
      }
      return ResponseService<GetAllUsers>({
        data: { users },
        status: 200,
        success: true,
        message: 'Users retrieved successfully',
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async getAllFirms(): Promise<unknown> {
    try {
      const users = await Database.User.findAll({
        include: [
          {
            model: Database.Role,
            as: 'role',
            attributes: ['id', 'name'],
          },
        ],
      });
      if (!users || users.length === 0) {
        ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Users not found',
          res: this.res,
        });
        return;
      }

      return ResponseService<GetAllUsers>({
        data: { users },
        status: 200,
        success: true,
        message: 'Users retrieved successfully',
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }
}
