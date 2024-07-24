import { Router } from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser, selectAllCompanyPositions, assignUserToProject, removeUserFromProject } from '../modules/users/usersController';
import {authenticateToken} from '../middleware/authenticateToken';
import {authorizePermission} from '../middleware/authorizePermission';

const router = Router();

router.post('/login', loginUser);
// router.post('/register', createUser); //odkomentowac zeby dalo sie dodac pierwszego usera, podobnie z innymi
router.post('/register', authenticateToken, authorizePermission('User management'), createUser);
router.get('/position', authenticateToken, authorizePermission('User management'), selectAllCompanyPositions);
router.get('/', authenticateToken, authorizePermission('User management'), getAllUsers);
router.post('/:user_id/project/:project_id', authenticateToken, authorizePermission('User management'), assignUserToProject)
router.get('/:id', authenticateToken, authorizePermission('User management'), getUserById);
router.put('/:id', authenticateToken, authorizePermission('User management'), updateUser);
router.delete('/:user_id/project/:project_id', authenticateToken, authorizePermission('User management'), removeUserFromProject);
router.delete('/:id', authenticateToken, authorizePermission('User management'), deleteUser);

module.exports = router