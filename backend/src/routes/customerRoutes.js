import express from 'express';
import {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController.js';
import auth from '../middleware/auth.js';
import permitRoles from '../middleware/role.js';

const router = express.Router();

// All roles can view
router.get('/', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getAllCustomers);
router.get('/:customer_id', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getCustomer);

// Only Admin and Backend Dev can modify
router.post('/', auth, permitRoles('Administrator', 'Backend Developer'), createCustomer);
router.put('/:customer_id', auth, permitRoles('Administrator', 'Backend Developer'), updateCustomer);
router.delete('/:customer_id', auth, permitRoles('Administrator', 'Backend Developer'), deleteCustomer);

export default router; 