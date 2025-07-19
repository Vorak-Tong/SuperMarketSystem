import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ProductCategory = sequelize.define('ProductCategory', {
  category_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  category_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'product_categories',
  timestamps: false,
});

export default ProductCategory; 