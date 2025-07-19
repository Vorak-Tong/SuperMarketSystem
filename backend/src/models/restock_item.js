import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import RestockOrder from './restock_order.js';
import Product from './product.js';

const RestockItem = sequelize.define('RestockItem', {
  restock_order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: RestockOrder,
      key: 'restock_order_id',
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
}, {
  tableName: 'restock_items',
  timestamps: false,
});

RestockItem.belongsTo(RestockOrder, { foreignKey: 'restock_order_id', as: 'restock_order' });
RestockItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

export default RestockItem; 