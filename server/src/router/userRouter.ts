import express from 'express';
const router = express.Router();

const { registerUser, loginUser, getUsers, deleteUser, updateUser } = require('../modules/users/usersController');
const { authenticateJWT } = require('../middlewares/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/listAllUsers', authenticateJWT, getUsers);
router.delete('/:userId', authenticateJWT, deleteUser);
router.put('/:userId', authenticateJWT, updateUser);

module.exports = router;