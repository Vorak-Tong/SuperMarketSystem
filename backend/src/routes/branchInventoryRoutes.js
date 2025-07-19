import express from 'express';
import {
  getAllBranchInventory,
  getBranchInventory,
  createBranchInventory,
  updateBranchInventory,
  deleteBranchInventory
} from '../controllers/branchInventoryController.js';
import auth from '../middleware/auth.js';
import permitRoles from '../middleware/role.js';

const router = express.Router();

// All roles can view
router.get('/', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getAllBranchInventory);
router.get('/:branch_id/:product_id', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getBranchInventory);

// Only Admin and Backend Dev can modify
router.post('/', auth, permitRoles('Administrator', 'Backend Developer'), createBranchInventory);
router.put('/:branch_id/:product_id', auth, permitRoles('Administrator', 'Backend Developer'), updateBranchInventory);
router.delete('/:branch_id/:product_id', auth, permitRoles('Administrator', 'Backend Developer'), deleteBranchInventory);

export default router; 