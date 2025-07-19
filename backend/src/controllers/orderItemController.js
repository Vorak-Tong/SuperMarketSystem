import OrderItem from '../models/order_item.js';
import Order from '../models/order.js';
import Product from '../models/product.js';

export const getAllOrderItems = async (req, res) => {
  try {
    const items = await OrderItem.findAll({
      include: [
        { model: Order, as: 'order' },
        { model: Product, as: 'product' }
      ]
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getOrderItem = async (req, res) => {
  const { order_id, product_id } = req.params;
  try {
    const item = await OrderItem.findOne({
      where: { order_id, product_id },
      include: [
        { model: Order, as: 'order' },
        { model: Product, as: 'product' }
      ]
    });
    if (!item) return res.status(404).json({ message: 'Order item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createOrderItem = async (req, res) => {
  const { order_id, product_id, quantity, unit_price } = req.body;
  try {
    const item = await OrderItem.create({ order_id, product_id, quantity, unit_price });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateOrderItem = async (req, res) => {
  const { order_id, product_id } = req.params;
  const { quantity, unit_price } = req.body;
  try {
    const item = await OrderItem.findOne({ where: { order_id, product_id } });
    if (!item) return res.status(404).json({ message: 'Order item not found' });
    if (quantity !== undefined) item.quantity = quantity;
    if (unit_price !== undefined) item.unit_price = unit_price;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteOrderItem = async (req, res) => {
  const { order_id, product_id } = req.params;
  try {
    const item = await OrderItem.findOne({ where: { order_id, product_id } });
    if (!item) return res.status(404).json({ message: 'Order item not found' });
    await item.destroy();
    res.json({ message: 'Order item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 