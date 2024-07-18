import { Router } from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser } from '../modules/users/usersController';
import {authenticateToken} from '../middleware/authenticateToken';
import {authorizePermission} from '../middleware/authorizePermission';

const router = Router();

router.post('/login', loginUser);
// router.post('/register', createUser); //odkomentowac zeby dalo sie dodac pierwszego usera
router.post('/register', authenticateToken, authorizePermission('User management'), createUser);
router.get('/', authenticateToken, authorizePermission('User management'), getAllUsers);
router.get('/:id', authenticateToken, authorizePermission('User management'), getUserById);
router.put('/:id', authenticateToken, authorizePermission('User management'), updateUser);
router.delete('/:id', authenticateToken, authorizePermission('User management'), deleteUser);

module.exports = router