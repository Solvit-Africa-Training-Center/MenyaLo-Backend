import { Request, Response } from 'express';
import { RoleService } from './service';

export class RoleController {
  public async createRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roleService = new RoleService(req.body, id, res);
      roleService.create();
    } catch (error) {
      throw error as Error;
    }
  }

  public async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roleService = new RoleService(req.body, id, res);
      roleService.findAll();
    } catch (error) {
      throw error as Error;
    }
  }

  public async getASingleRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roleService = new RoleService(req.body, id, res);
      roleService.findOne();
    } catch (error) {
      throw error as Error;
    }
  }

  public async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roleService = new RoleService(req.body, id, res);
      roleService.update();
    } catch (error) {
      throw error as Error;
    }
  }

  public async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roleService = new RoleService(req.body, id, res);
      roleService.delete();
    } catch (error) {
      throw error as Error;
    }
  }
}
