import RestockItem from '../models/restock_item.js';
import RestockOrder from '../models/restock_order.js';
import Product from '../models/product.js';

export const getAllRestockItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { rows, count } = await RestockItem.findAndCountAll({
      include: [
        { model: RestockOrder, as: 'restock_order' },
        { model: Product, as: 'product' }
      ],
      offset,
      limit
    });
    res.json({ data: rows, total: count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getRestockItem = async (req, res) => {
  const { restock_order_id, product_id } = req.params;
  try {
    const item = await RestockItem.findOne({
      where: { restock_order_id, product_id },
      include: [
        { model: RestockOrder, as: 'restock_order' },
        { model: Product, as: 'product' }
      ]
    });
    if (!item) return res.status(404).json({ message: 'Restock item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createRestockItem = async (req, res) => {
  const { restock_order_id, product_id, quantity } = req.body;
  try {
    const item = await RestockItem.create({ restock_order_id, product_id, quantity });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateRestockItem = async (req, res) => {
  const { restock_order_id, product_id } = req.params;
  const { quantity } = req.body;
  try {
    const item = await RestockItem.findOne({ where: { restock_order_id, product_id } });
    if (!item) return res.status(404).json({ message: 'Restock item not found' });
    if (quantity !== undefined) item.quantity = quantity;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteRestockItem = async (req, res) => {
  const { restock_order_id, product_id } = req.params;
  try {
    const item = await RestockItem.findOne({ where: { restock_order_id, product_id } });
    if (!item) return res.status(404).json({ message: 'Restock item not found' });
    await item.destroy();
    res.json({ message: 'Restock item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 