import express from 'express';
import {
  getAllRestockItems,
  getRestockItem,
  createRestockItem,
  updateRestockItem,
  deleteRestockItem
} from '../controllers/restockItemController.js';
import auth from '../middleware/auth.js';
import permitRoles from '../middleware/role.js';

const router = express.Router();

// All roles can view
router.get('/', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getAllRestockItems);
router.get('/:restock_order_id/:product_id', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getRestockItem);

// Only Admin and Backend Dev can modify
router.post('/', auth, permitRoles('Administrator', 'Backend Developer'), createRestockItem);
router.put('/:restock_order_id/:product_id', auth, permitRoles('Administrator', 'Backend Developer'), updateRestockItem);
router.delete('/:restock_order_id/:product_id', auth, permitRoles('Administrator', 'Backend Developer'), deleteRestockItem);

export default router; 