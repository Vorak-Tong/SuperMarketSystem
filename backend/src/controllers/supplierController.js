import Supplier from '../models/supplier.js';

export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.supplier_id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createSupplier = async (req, res) => {
  const { supplier_name, phone, address } = req.body;
  try {
    const supplier = await Supplier.create({ supplier_name, phone, address });
    res.status(201).json(supplier);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.supplier_id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    const { supplier_name, phone, address } = req.body;
    if (supplier_name) supplier.supplier_name = supplier_name;
    if (phone) supplier.phone = phone;
    if (address) supplier.address = address;
    await supplier.save();
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.supplier_id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    await supplier.destroy();
    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 