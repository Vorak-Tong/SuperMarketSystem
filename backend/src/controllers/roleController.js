import Role from '../models/role.js';

export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 