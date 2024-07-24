import { Router } from 'express';
import { selectAllRoles, addNewRole } from '../modules/permissions/addNewRole';
import { deleteRole } from '../modules/permissions/deleteRole';
import { updateRole } from '../modules/permissions/updateRole';
import { getAllPermissions } from '../modules/permissions/selectAllPermissions';
import { addNewPermission, changePermission } from '../modules/permissions/changePermission';
import { getAllModules } from '../modules/permissions/selectAllModules';
import { addNewModule } from '../modules/permissions/addNewModule';
import { deleteModule } from '../modules/permissions/deleteModule';
import { updateModule } from '../modules/permissions/updateModule';

import { authenticateToken } from '../middleware/authenticateToken';

const router = Router();

// Trasy ról
router.get('/role', selectAllRoles);
router.post('/role/new', addNewRole);
router.delete('/role/:role_id', deleteRole);
router.put('/role/:role_id', updateRole);

//Trasy modułów
router.get('/module', getAllModules);
router.post('/module/new', addNewModule);
router.delete('/module/:module_id', deleteModule);
router.put('/module/:module_id', updateModule);

//Trasy uprawnień
router.get('/', getAllPermissions);
router.post('/new', addNewPermission);
router.put('/:permission_id', changePermission);

module.exports = router;