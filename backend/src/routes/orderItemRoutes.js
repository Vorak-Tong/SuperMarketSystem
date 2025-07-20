import express from 'express';
import {
  getAllOrderItems,
  getOrderItem,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
  getTotalSales,
  getTopProducts
} from '../controllers/orderItemController.js';
import auth from '../middleware/auth.js';
import permitRoles from '../middleware/role.js';

const router = express.Router();

// All roles can view
router.get('/', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getAllOrderItems);
router.get('/:order_id/:product_id', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getOrderItem);

// Dashboard stats
router.get('/total-sales', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getTotalSales);
router.get('/top-products', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getTopProducts);

// Only Admin and Backend Dev can modify
router.post('/', auth, permitRoles('Administrator', 'Backend Developer'), createOrderItem);
router.put('/:order_id/:product_id', auth, permitRoles('Administrator', 'Backend Developer'), updateOrderItem);
router.delete('/:order_id/:product_id', auth, permitRoles('Administrator', 'Backend Developer'), deleteOrderItem);

export default router; 