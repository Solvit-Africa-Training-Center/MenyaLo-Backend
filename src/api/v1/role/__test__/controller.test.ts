import { Request, Response } from 'express';
import RoleController from '../../role/controller';
import { roleService } from '../service';

// Mock the service
jest.mock('../service', () => ({
  roleService: {
    getAllRoles: jest.fn(),
    getRoleById: jest.fn(),
    createRole: jest.fn(),
    updateRole: jest.fn(),
    deleteRole: jest.fn(),
  },
}));

// Helper to mock response object
const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('RoleController Full Coverage', () => {
  afterEach(() => jest.clearAllMocks());

  // GET /roles
  it('getAllRoles - success and error', async () => {
    const req = {} as Request;
    const res = mockResponse();

    // success
    (roleService.getAllRoles as jest.Mock).mockResolvedValue([{ id: '1', name: 'Admin', permissions: [] }]);
    await RoleController.getAllRoles(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));

    // error
    (roleService.getAllRoles as jest.Mock).mockRejectedValue(new Error('Error'));
    await RoleController.getAllRoles(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Failed to fetch roles' }));
  });

  // GET /roles/:id
  it('getRoleById - success, not found, error', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockResponse();

    // success
    (roleService.getRoleById as jest.Mock).mockResolvedValue({ id: '1', name: 'Admin', permissions: [] });
    await RoleController.getRoleById(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));

    // not found
    (roleService.getRoleById as jest.Mock).mockResolvedValue(null);
    await RoleController.getRoleById(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Role not found' }));

    // error
    (roleService.getRoleById as jest.Mock).mockRejectedValue(new Error('Error'));
    await RoleController.getRoleById(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Failed to fetch role' }));
  });

  // POST /roles
  it('createRole - success, missing name, error', async () => {
    const res = mockResponse();

    // success
    let req = { body: { name: 'Admin', permissions: ['read'] } } as Request;
    (roleService.createRole as jest.Mock).mockResolvedValue({ id: '1', name: 'Admin', permissions: ['read'] });
    await RoleController.createRole(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));

    // missing name
    req = { body: { permissions: ['read'] } } as Request;
    await RoleController.createRole(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Role name is required' }));

    // error
    req = { body: { name: 'Admin', permissions: ['read'] } } as Request;
    (roleService.createRole as jest.Mock).mockRejectedValue(new Error('Error'));
    await RoleController.createRole(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Failed to create role' }));
  });

  // PUT /roles/:id
  it('updateRole - success, not found, error', async () => {
    const res = mockResponse();
    const req = { params: { id: '1' }, body: { name: 'Admin', permissions: [] } } as unknown as Request;

    // success
    (roleService.updateRole as jest.Mock).mockResolvedValue({ id: '1', name: 'Admin', permissions: [] });
    await RoleController.updateRole(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));

    // not found
    (roleService.updateRole as jest.Mock).mockResolvedValue(null);
    await RoleController.updateRole(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Role not found' }));

    // error
    (roleService.updateRole as jest.Mock).mockRejectedValue(new Error('Error'));
    await RoleController.updateRole(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Failed to update role' }));
  });

  it('deleteRole - success, not found, error', async () => {
    const res = mockResponse();
    const req = { params: { id: '1' } } as unknown as Request;

    (roleService.deleteRole as jest.Mock).mockResolvedValue({ id: '1' });
    await RoleController.deleteRole(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));

    (roleService.deleteRole as jest.Mock).mockResolvedValue(null);
    await RoleController.deleteRole(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Role not found' }));

    (roleService.deleteRole as jest.Mock).mockRejectedValue(new Error('Error'));
    await RoleController.deleteRole(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Failed to delete role' }));
  });
});
