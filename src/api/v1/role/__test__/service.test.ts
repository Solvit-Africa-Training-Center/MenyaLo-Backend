import { roleService } from '../service';
import { Role } from '../../../../database/models/Role';

jest.mock('../../../../database/models/Role.ts', () => ({
  Role: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

describe('RoleService', () => {
  afterEach(() => jest.clearAllMocks());

  it('should create a role', async () => {
    const roleData = { name: 'Admin', permissions: ['read'] };
    const mockRole = { id: '1', ...roleData };
    (Role.create as jest.Mock).mockResolvedValue(mockRole);

    const result = await roleService.createRole(roleData);

    expect(Role.create).toHaveBeenCalledWith(roleData);
    expect(result).toEqual(mockRole);
  });

  it('should get all roles', async () => {
    const mockRoles = [{ id: '1', name: 'Admin', permissions: ['read'] }];
    (Role.findAll as jest.Mock).mockResolvedValue(mockRoles);

    const result = await roleService.getAllRoles();

    expect(Role.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockRoles);
  });

  it('should get role by id', async () => {
    const mockRole = { id: '1', name: 'Admin', permissions: ['read'] };
    (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);

    const result = await roleService.getRoleById('1');

    expect(Role.findByPk).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockRole);
  });

  it('should return null if role by id does not exist', async () => {
    (Role.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await roleService.getRoleById('999');

    expect(Role.findByPk).toHaveBeenCalledWith('999');
    expect(result).toBeNull();
  });

  it('should update a role', async () => {
    const mockRole: { id: string; name: string; permissions: string[]; update: jest.Mock } = { id: '1', name: 'Admin', permissions: ['read'], update: jest.fn().mockResolvedValue({ id: '1', name: 'Admin Updated', permissions: ['read'] }) };
    (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);

    const result = await roleService.updateRole('1', { name: 'Admin Updated' });

    expect(Role.findByPk).toHaveBeenCalledWith('1');
    expect(mockRole.update).toHaveBeenCalledWith({ name: 'Admin Updated' });
    expect(result).toEqual({ id: '1', name: 'Admin Updated', permissions: ['read'] });
  });

  it('should return null when updating non-existing role', async () => {
    (Role.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await roleService.updateRole('999', { name: 'Admin Updated' });

    expect(Role.findByPk).toHaveBeenCalledWith('999');
    expect(result).toBeNull();
  });

  it('should delete a role', async () => {
    const mockRole: { id: string; destroy: jest.Mock } = { id: '1', destroy: jest.fn().mockResolvedValue(undefined) };
    (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);

    const result = await roleService.deleteRole('1');

    expect(Role.findByPk).toHaveBeenCalledWith('1');
    expect(mockRole.destroy).toHaveBeenCalled();
    expect(result).toEqual(mockRole);
  });

  it('should return null when deleting non-existing role', async () => {
    (Role.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await roleService.deleteRole('999');

    expect(Role.findByPk).toHaveBeenCalledWith('999');
    expect(result).toBeNull();
  });
});
