import { Router } from 'express';
import RoleController from './controller';

const router = Router();

router.get('/', RoleController.getAllRoles);

router.get('/:id', RoleController.getRoleById);

router.post('/', RoleController.createRole);

router.put('/:id', RoleController.updateRole);

router.delete('/:id', RoleController.deleteRole);

export default router;
