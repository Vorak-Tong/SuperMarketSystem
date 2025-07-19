import User from '../models/user.js';
import Role from '../models/role.js';
import { comparePassword, hashPassword } from '../utils/hash.js';

// Get own profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      include: [{ model: Role, as: 'role' }],
      attributes: { exclude: ['password_hash'] },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Change own password
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findByPk(req.user.user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const valid = await comparePassword(oldPassword, user.password_hash);
    if (!valid) return res.status(400).json({ message: 'Old password is incorrect' });
    user.password_hash = await hashPassword(newPassword);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 