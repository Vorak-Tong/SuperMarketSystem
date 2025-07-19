import Customer from '../models/customer.js';

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.customer_id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createCustomer = async (req, res) => {
  const { first_name, last_name, email, phone, address } = req.body;
  try {
    const customer = await Customer.create({ first_name, last_name, email, phone, address });
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.customer_id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    const { first_name, last_name, email, phone, address } = req.body;
    if (first_name) customer.first_name = first_name;
    if (last_name) customer.last_name = last_name;
    if (email) customer.email = email;
    if (phone) customer.phone = phone;
    if (address) customer.address = address;
    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.customer_id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    await customer.destroy();
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 