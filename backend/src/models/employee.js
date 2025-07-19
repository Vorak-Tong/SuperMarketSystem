import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Branch from './branch.js';

const Employee = sequelize.define('Employee', {
  employee_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  branch_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Branch,
      key: 'branch_id',
    },
  },
}, {
  tableName: 'employees',
  timestamps: false,
});

Employee.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });

export default Employee; 