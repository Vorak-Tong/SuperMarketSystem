import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Branch from './branch.js';
import Product from './product.js';

const BranchInventory = sequelize.define('BranchInventory', {
  branch_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Branch,
      key: 'branch_id',
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
    validate: { min: 0 },
  },
}, {
  tableName: 'branch_inventory',
  timestamps: false,
});

BranchInventory.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });
BranchInventory.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

export default BranchInventory; 