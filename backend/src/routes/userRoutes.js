import express from 'express';
import { getProfile, changePassword } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/me', auth, getProfile);
router.post('/change-password', auth, changePassword);

export default router; 