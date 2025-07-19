import User from '../models/user.js';
import Role from '../models/role.js';
import { comparePassword } from '../utils/hash.js';
import jwt from 'jsonwebtoken';
import { hashPassword } from '../utils/hash.js';

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      where: { username },
      include: [{ model: Role, as: 'role' }],
    });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        role_id: user.role_id,
        role_name: user.role.role_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        role_id: user.role_id,
        role_name: user.role.role_name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const signup = async (req, res) => {
  const { username, password, role_id } = req.body;
  try {
    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ message: 'Username already exists' });
    // Only allow Backend Developer (2) or Business Analyst (3)
    const safeRole = [2, 3].includes(Number(role_id)) ? Number(role_id) : 3;
    const password_hash = await hashPassword(password);
    const user = await User.create({ username, password_hash, role_id: safeRole });
    res.status(201).json({ message: 'User created', user: { username: user.username, role_id: user.role_id } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 