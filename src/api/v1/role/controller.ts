import { Request, Response } from 'express';
import { roleService } from '../role/service';

class RoleController {
  async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await roleService.getAllRoles();
      res.json({ success: true, message: 'Roles fetched successfully', data: roles });
    } catch {
      res.json({ success: false, message: 'Failed to fetch roles', data: null });
    }
  }

  async getRoleById(req: Request, res: Response): Promise<void> {
    try {
      const role = await roleService.getRoleById(req.params.id);
      if (!role) {
        res.json({ success: false, message: 'Role not found', data: null });
        return;
      }
      res.json({ success: true, message: 'Role fetched successfully', data: role });
    } catch {
      res.json({ success: false, message: 'Failed to fetch role', data: null });
    }
  }

  async createRole(req: Request, res: Response): Promise<void> {
    try {
      const { name, permissions } = req.body;

      if (!name) {
        res.json({ success: false, message: 'Role name is required', data: null });
        return;
      }

      const role = await roleService.createRole({
        name,
        permissions: Array.isArray(permissions) ? permissions : [],
      });

      res.json({ success: true, message: 'Role created successfully', data: role });
    } catch {
      res.json({ success: false, message: 'Failed to create role', data: null });
    }
  }

  async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const { name, permissions } = req.body;

      const role = await roleService.updateRole(req.params.id, {
        name,
        permissions: Array.isArray(permissions) ? permissions : [],
      });

      if (!role) {
        res.json({ success: false, message: 'Role not found', data: null });
        return;
      }

      res.json({ success: true, message: 'Role updated successfully', data: role });
    } catch {
      res.json({ success: false, message: 'Failed to update role', data: null });
    }
  }

  async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      const role = await roleService.deleteRole(req.params.id);

      if (!role) {
        res.json({ success: false, message: 'Role not found', data: null });
        return;
      }

      res.json({ success: true, message: 'Role deleted successfully', data: null });
    } catch {
      res.json({ success: false, message: 'Failed to delete role', data: null });
    }
  }
}

export default new RoleController();
