import sequelize from '../config/db.js';
import Role from './role.js';
import User from './user.js';
import ProductCategory from './product_category.js';
import Product from './product.js';
import Branch from './branch.js';
import BranchInventory from './branch_inventory.js';
import Customer from './customer.js';
import Employee from './employee.js';
import Order from './order.js';
import OrderItem from './order_item.js';
import Payment from './payment.js';
import Supplier from './supplier.js';
import RestockOrder from './restock_order.js';
import RestockItem from './restock_item.js';

// All associations are defined in their respective model files

const db = {
  sequelize,
  Role,
  User,
  ProductCategory,
  Product,
  Branch,
  BranchInventory,
  Customer,
  Employee,
  Order,
  OrderItem,
  Payment,
  Supplier,
  RestockOrder,
  RestockItem,
};

export default db; 