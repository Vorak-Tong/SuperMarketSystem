import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Supplier from './supplier.js';
import Branch from './branch.js';

const RestockOrder = sequelize.define('RestockOrder', {
  restock_order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Supplier,
      key: 'supplier_id',
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
  status: {
    type: DataTypes.STRING(50),
  },
}, {
  tableName: 'restock_orders',
  timestamps: false,
});

RestockOrder.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });
RestockOrder.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });

export default RestockOrder; 