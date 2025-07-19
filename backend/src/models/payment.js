import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Order from './order.js';

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: Order,
      key: 'order_id',
    },
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'payments',
  timestamps: false,
});

Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

export default Payment; 