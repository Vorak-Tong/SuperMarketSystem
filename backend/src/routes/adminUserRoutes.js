import express from 'express';
import { listUsers, createUser, updateUser, deleteUser } from '../controllers/adminUserController.js';
import auth from '../middleware/auth.js';
import permitRoles from '../middleware/role.js';

const router = express.Router();

// Only Administrator can access these routes
router.use(auth, permitRoles('Administrator'));

router.get('/', listUsers);
router.post('/', createUser);
router.put('/:user_id', updateUser);
router.delete('/:user_id', deleteUser);

export default router; 