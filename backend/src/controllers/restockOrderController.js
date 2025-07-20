import RestockOrder from '../models/restock_order.js';
import Supplier from '../models/supplier.js';
import Branch from '../models/branch.js';

export const getAllRestockOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { rows, count } = await RestockOrder.findAndCountAll({
      include: [
        { model: Supplier, as: 'supplier' },
        { model: Branch, as: 'branch' }
      ],
      offset,
      limit
    });
    res.json({ data: rows, total: count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getRestockOrder = async (req, res) => {
  try {
    const order = await RestockOrder.findByPk(req.params.restock_order_id, { include: [
      { model: Supplier, as: 'supplier' },
      { model: Branch, as: 'branch' }
    ] });
    if (!order) return res.status(404).json({ message: 'Restock order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createRestockOrder = async (req, res) => {
  const { supplier_id, branch_id, order_date, status } = req.body;
  try {
    const order = await RestockOrder.create({ supplier_id, branch_id, order_date, status });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateRestockOrder = async (req, res) => {
  try {
    const order = await RestockOrder.findByPk(req.params.restock_order_id);
    if (!order) return res.status(404).json({ message: 'Restock order not found' });
    const { supplier_id, branch_id, order_date, status } = req.body;
    if (supplier_id !== undefined) order.supplier_id = supplier_id;
    if (branch_id !== undefined) order.branch_id = branch_id;
    if (order_date) order.order_date = order_date;
    if (status) order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteRestockOrder = async (req, res) => {
  try {
    const order = await RestockOrder.findByPk(req.params.restock_order_id);
    if (!order) return res.status(404).json({ message: 'Restock order not found' });
    await order.destroy();
    res.json({ message: 'Restock order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 