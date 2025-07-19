import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import ProductCategory from './product_category.js';

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 },
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ProductCategory,
      key: 'category_id',
    },
  },
  brand: {
    type: DataTypes.STRING(100),
  },
}, {
  tableName: 'products',
  timestamps: false,
});

Product.belongsTo(ProductCategory, { foreignKey: 'category_id', as: 'category' });

export default Product; 