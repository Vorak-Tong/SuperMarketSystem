import express from 'express';
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import auth from '../middleware/auth.js';
import permitRoles from '../middleware/role.js';

const router = express.Router();

// All roles can view
router.get('/', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getAllProducts);
router.get('/:product_id', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getProduct);

// Only Admin and Backend Dev can modify
router.post('/', auth, permitRoles('Administrator', 'Backend Developer'), createProduct);
router.put('/:product_id', auth, permitRoles('Administrator', 'Backend Developer'), updateProduct);
router.delete('/:product_id', auth, permitRoles('Administrator', 'Backend Developer'), deleteProduct);

export default router; 