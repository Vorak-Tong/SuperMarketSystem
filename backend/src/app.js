import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';
import productRoutes from './routes/productRoutes.js';
import productCategoryRoutes from './routes/productCategoryRoutes.js';
import branchRoutes from './routes/branchRoutes.js';
import branchInventoryRoutes from './routes/branchInventoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import orderItemRoutes from './routes/orderItemRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import restockOrderRoutes from './routes/restockOrderRoutes.js';
import restockItemRoutes from './routes/restockItemRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', productCategoryRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/branch-inventory', branchInventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/restock-orders', restockOrderRoutes);
app.use('/api/restock-items', restockItemRoutes);

// Placeholder route
app.get('/', (req, res) => {
  res.json({ message: 'Supermarket System API' });
});

export default app; 