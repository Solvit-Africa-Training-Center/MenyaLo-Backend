import { Role } from '../../../database/models/Role';

export class RoleService {
  async createRole(data: { name: string; permissions?: string[] }): Promise<Role> {
    return await Role.create(data);
  }

  async getAllRoles(): Promise<Role[]> {
    return await Role.findAll();
  }

  async getRoleById(id: string): Promise<Role | null> {
    return await Role.findByPk(id);
  }

  async updateRole(id: string, data: Partial<{ name: string; permissions: string[] }>): Promise<Role | null> {
    const role = await Role.findByPk(id);
    if (!role) {
      return null;
    }
    return await role.update(data);
  }

  async deleteRole(id: string): Promise<Role | null> {
    const role = await Role.findByPk(id);
    if (!role) {
      return null;
    }
    await role.destroy();
    return role;
  }
}

export const roleService = new RoleService();
