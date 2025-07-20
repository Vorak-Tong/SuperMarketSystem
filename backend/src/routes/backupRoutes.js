import express from 'express';
import auth from '../middleware/auth.js';
import role from '../middleware/role.js';
import backupController from '../controllers/backupController.js';

const router = express.Router();

// POST /api/backup/full - Admin only
router.post('/full', auth, role('admin'), backupController.fullBackup);

export default router; 