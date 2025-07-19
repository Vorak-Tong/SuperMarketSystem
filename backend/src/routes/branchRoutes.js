import express from 'express';
import {
  getAllBranches,
  getBranch,
  createBranch,
  updateBranch,
  deleteBranch
} from '../controllers/branchController.js';
import auth from '../middleware/auth.js';
import permitRoles from '../middleware/role.js';

const router = express.Router();

// All roles can view
router.get('/', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getAllBranches);
router.get('/:branch_id', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getBranch);

// Only Admin and Backend Dev can modify
router.post('/', auth, permitRoles('Administrator', 'Backend Developer'), createBranch);
router.put('/:branch_id', auth, permitRoles('Administrator', 'Backend Developer'), updateBranch);
router.delete('/:branch_id', auth, permitRoles('Administrator', 'Backend Developer'), deleteBranch);

export default router; 