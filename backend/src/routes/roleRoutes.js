import express from 'express';
import { getAllRoles } from '../controllers/roleController.js';

const router = express.Router();

router.get('/', getAllRoles);

export default router; 