import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Branch = sequelize.define('Branch', {
  branch_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  branch_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'branches',
  timestamps: false,
});

export default Branch; 