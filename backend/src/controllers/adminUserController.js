import User from '../models/user.js';
import Role from '../models/role.js';
import { hashPassword } from '../utils/hash.js';

// List all users (with roles)
export const listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, as: 'role' }],
      attributes: { exclude: ['password_hash'] },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  const { username, password, role_id } = req.body;
  try {
    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ message: 'Username already exists' });
    const password_hash = await hashPassword(password);
    const user = await User.create({ username, password_hash, role_id });
    res.status(201).json({ user_id: user.user_id, username: user.username, role_id: user.role_id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update user (including role)
export const updateUser = async (req, res) => {
  const { user_id } = req.params;
  const { username, password, role_id } = req.body;
  try {
    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (username) user.username = username;
    if (password) user.password_hash = await hashPassword(password);
    if (role_id) user.role_id = role_id;
    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 