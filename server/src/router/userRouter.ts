import { Router } from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser } from '../modules/users/usersController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.post('/login', loginUser);
router.post('/', authenticateToken, authorizeRole(['admin']), createUser);
router.get('/', authenticateToken, authorizeRole(['admin', 'user']), getAllUsers);
router.get('/:id', authenticateToken, authorizeRole(['admin', 'user']), getUserById);
router.put('/:id', authenticateToken, authorizeRole(['admin']), updateUser);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteUser);

module.exports = router