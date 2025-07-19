import Payment from '../models/payment.js';
import Order from '../models/order.js';

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({ include: [{ model: Order, as: 'order' }] });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.payment_id, { include: [{ model: Order, as: 'order' }] });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createPayment = async (req, res) => {
  const { order_id, payment_method, payment_date } = req.body;
  try {
    const payment = await Payment.create({ order_id, payment_method, payment_date });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.payment_id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    const { order_id, payment_method, payment_date } = req.body;
    if (order_id) payment.order_id = order_id;
    if (payment_method) payment.payment_method = payment_method;
    if (payment_date) payment.payment_date = payment_date;
    await payment.save();
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.payment_id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    await payment.destroy();
    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 