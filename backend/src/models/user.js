import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Role from './role.js';

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: 'role_id',
    },
  },
}, {
  tableName: 'users',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['username'] }
  ]
});

User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

export default User; 