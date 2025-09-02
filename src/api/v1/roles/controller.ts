import { Request, Response } from 'express';
import { RoleService } from './service';

export class RoleController {
  public async createRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roleService = new RoleService(req.body, id, res);
<<<<<<< HEAD
      roleService.create();
=======
      roleService.createRole();
>>>>>>> 833906b (Initial MenyaLo backend setup:)
    } catch (error) {
      throw error as Error;
    }
  }

  public async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roleService = new RoleService(req.body, id, res);
<<<<<<< HEAD
      roleService.findAll();
=======
      roleService.getAllRoles();
>>>>>>> 833906b (Initial MenyaLo backend setup:)
    } catch (error) {
      throw error as Error;
    }
  }

  public async getASingleRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roleService = new RoleService(req.body, id, res);
<<<<<<< HEAD
      roleService.findOne();
=======
      roleService.getASingleRole();
>>>>>>> 833906b (Initial MenyaLo backend setup:)
    } catch (error) {
      throw error as Error;
    }
  }

  public async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roleService = new RoleService(req.body, id, res);
<<<<<<< HEAD
      roleService.update();
=======
      roleService.updateRole();
>>>>>>> 833906b (Initial MenyaLo backend setup:)
    } catch (error) {
      throw error as Error;
    }
  }

  public async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roleService = new RoleService(req.body, id, res);
<<<<<<< HEAD
      roleService.delete();
=======
      roleService.deleteRole();
>>>>>>> 833906b (Initial MenyaLo backend setup:)
    } catch (error) {
      throw error as Error;
    }
  }
}
