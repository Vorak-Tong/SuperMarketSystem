import express from 'express';
import {
  getAllPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment
} from '../controllers/paymentController.js';
import auth from '../middleware/auth.js';
import permitRoles from '../middleware/role.js';

const router = express.Router();

// All roles can view
router.get('/', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getAllPayments);
router.get('/:payment_id', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getPayment);

// Only Admin and Backend Dev can modify
router.post('/', auth, permitRoles('Administrator', 'Backend Developer'), createPayment);
router.put('/:payment_id', auth, permitRoles('Administrator', 'Backend Developer'), updatePayment);
router.delete('/:payment_id', auth, permitRoles('Administrator', 'Backend Developer'), deletePayment);

export default router; 