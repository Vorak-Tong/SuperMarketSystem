import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Customer from './customer.js';
import Branch from './branch.js';

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Customer,
      key: 'customer_id',
    },
  },
  branch_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Branch,
      key: 'branch_id',
    },
  },
  order_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'orders',
  timestamps: false,
  indexes: [
    { fields: ['order_date'] },
    { fields: ['customer_id'] },
    { fields: ['branch_id'] }
  ]
});

Order.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Order.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });

export default Order; 