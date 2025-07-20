import OrderItem from '../models/order_item.js';
import Order from '../models/order.js';
import Product from '../models/product.js';
import sequelize from '../config/db.js';
import redisClient from '../config/redis.js';

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

// GET /api/order-items/total-sales
export const getTotalSales = async (req, res) => {
  const cacheKey = 'dashboard:totalSales';
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({ totalSales: Number(cached), cached: true });
    }
    const result = await OrderItem.findAll({
      attributes: [[sequelize.literal('SUM(unit_price * quantity)'), 'totalSales']]
    });
    const totalSales = Number(result[0].get('totalSales')) || 0;
    await redisClient.set(cacheKey, totalSales, { EX: 300 });
    res.json({ totalSales, cached: false });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get total sales', error: err.message });
  }
};

// GET /api/order-items/top-products?limit=5
export const getTopProducts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const cacheKey = `dashboard:topProducts:${limit}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({ topProducts: JSON.parse(cached), cached: true });
    }
    const topProducts = await OrderItem.findAll({
      attributes: [
        'product_id',
        [sequelize.fn('SUM', sequelize.literal('unit_price * quantity')), 'totalSales'],
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity']
      ],
      include: [{ model: Product, as: 'product', attributes: ['product_name'] }],
      group: ['OrderItem.product_id', 'product.product_id'],
      order: [[sequelize.literal('totalSales'), 'DESC']],
      limit
    });
    const result = topProducts.map(item => ({
      product_id: item.product_id,
      product_name: item.product?.product_name,
      totalSales: Number(item.get('totalSales')),
      totalQuantity: Number(item.get('totalQuantity'))
    }));
    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 300 });
    res.json({ topProducts: result, cached: false });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get top products', error: err.message });
  }
}; 