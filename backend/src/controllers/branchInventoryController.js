import BranchInventory from '../models/branch_inventory.js';
import Branch from '../models/branch.js';
import Product from '../models/product.js';

export const getAllBranchInventory = async (req, res) => {
  try {
    const inventory = await BranchInventory.findAll({
      include: [
        { model: Branch, as: 'branch' },
        { model: Product, as: 'product' }
      ]
    });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getBranchInventory = async (req, res) => {
  const { branch_id, product_id } = req.params;
  try {
    const item = await BranchInventory.findOne({
      where: { branch_id, product_id },
      include: [
        { model: Branch, as: 'branch' },
        { model: Product, as: 'product' }
      ]
    });
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createBranchInventory = async (req, res) => {
  const { branch_id, product_id, quantity } = req.body;
  try {
    const item = await BranchInventory.create({ branch_id, product_id, quantity });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateBranchInventory = async (req, res) => {
  const { branch_id, product_id } = req.params;
  const { quantity } = req.body;
  try {
    const item = await BranchInventory.findOne({ where: { branch_id, product_id } });
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });
    if (quantity !== undefined) item.quantity = quantity;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteBranchInventory = async (req, res) => {
  const { branch_id, product_id } = req.params;
  try {
    const item = await BranchInventory.findOne({ where: { branch_id, product_id } });
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });
    await item.destroy();
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 