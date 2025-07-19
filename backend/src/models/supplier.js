import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Supplier = sequelize.define('Supplier', {
  supplier_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  supplier_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'suppliers',
  timestamps: false,
});

export default Supplier; 