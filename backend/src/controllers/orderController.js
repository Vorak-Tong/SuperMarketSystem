import Order from '../models/order.js';
import Customer from '../models/customer.js';
import Branch from '../models/branch.js';

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Customer, as: 'customer' },
        { model: Branch, as: 'branch' }
      ]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.order_id, {
      include: [
        { model: Customer, as: 'customer' },
        { model: Branch, as: 'branch' }
      ]
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createOrder = async (req, res) => {
  const { customer_id, branch_id, order_date } = req.body;
  try {
    const order = await Order.create({ customer_id, branch_id, order_date });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.order_id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const { customer_id, branch_id, order_date } = req.body;
    if (customer_id) order.customer_id = customer_id;
    if (branch_id) order.branch_id = branch_id;
    if (order_date) order.order_date = order_date;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.order_id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await order.destroy();
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 