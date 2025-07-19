import express from 'express';
import {
  getAllRestockOrders,
  getRestockOrder,
  createRestockOrder,
  updateRestockOrder,
  deleteRestockOrder
} from '../controllers/restockOrderController.js';
import auth from '../middleware/auth.js';
import permitRoles from '../middleware/role.js';

const router = express.Router();

// All roles can view
router.get('/', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getAllRestockOrders);
router.get('/:restock_order_id', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getRestockOrder);

// Only Admin and Backend Dev can modify
router.post('/', auth, permitRoles('Administrator', 'Backend Developer'), createRestockOrder);
router.put('/:restock_order_id', auth, permitRoles('Administrator', 'Backend Developer'), updateRestockOrder);
router.delete('/:restock_order_id', auth, permitRoles('Administrator', 'Backend Developer'), deleteRestockOrder);

export default router; 