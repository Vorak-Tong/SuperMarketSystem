import Branch from '../models/branch.js';

export const getAllBranches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { rows, count } = await Branch.findAndCountAll({ offset, limit });
    res.json({ data: rows, total: count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getBranch = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.branch_id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.json(branch);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createBranch = async (req, res) => {
  const { branch_name, location, phone } = req.body;
  try {
    const branch = await Branch.create({ branch_name, location, phone });
    res.status(201).json(branch);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.branch_id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    const { branch_name, location, phone } = req.body;
    if (branch_name) branch.branch_name = branch_name;
    if (location) branch.location = location;
    if (phone) branch.phone = phone;
    await branch.save();
    res.json(branch);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.branch_id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    await branch.destroy();
    res.json({ message: 'Branch deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 