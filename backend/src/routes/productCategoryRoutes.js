import express from 'express';
import {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/productCategoryController.js';
import auth from '../middleware/auth.js';
import permitRoles from '../middleware/role.js';

const router = express.Router();

// All roles can view
router.get('/', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getAllCategories);
router.get('/:category_id', auth, permitRoles('Administrator', 'Backend Developer', 'Business Analyst'), getCategory);

// Only Admin and Backend Dev can modify
router.post('/', auth, permitRoles('Administrator', 'Backend Developer'), createCategory);
router.put('/:category_id', auth, permitRoles('Administrator', 'Backend Developer'), updateCategory);
router.delete('/:category_id', auth, permitRoles('Administrator', 'Backend Developer'), deleteCategory);

export default router; 