import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Order from './order.js';
import Product from './product.js';

const OrderItem = sequelize.define('OrderItem', {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Order,
      key: 'order_id',
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Product,
      key: 'product_id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 },
  },
}, {
  tableName: 'order_items',
  timestamps: false,
});

OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

export default OrderItem; 