import express from 'express';
import {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder
} from '../controllers/orderController.js';
import auth from '../middleware/auth.js';
import permitRoles from '../middleware/role.js';

const router = express.Router();

// All roles can view
router.get('/', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getAllOrders);
router.get('/:order_id', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getOrder);

// Only Admin and Backend Dev can modify
router.post('/', auth, permitRoles('Administrator', 'Backend Developer'), createOrder);
router.put('/:order_id', auth, permitRoles('Administrator', 'Backend Developer'), updateOrder);
router.delete('/:order_id', auth, permitRoles('Administrator', 'Backend Developer'), deleteOrder);

export default router; 