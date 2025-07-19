import Employee from '../models/employee.js';
import Branch from '../models/branch.js';

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({ include: [{ model: Branch, as: 'branch' }] });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.employee_id, { include: [{ model: Branch, as: 'branch' }] });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createEmployee = async (req, res) => {
  const { first_name, last_name, email, phone, position, branch_id } = req.body;
  try {
    const employee = await Employee.create({ first_name, last_name, email, phone, position, branch_id });
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.employee_id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    const { first_name, last_name, email, phone, position, branch_id } = req.body;
    if (first_name) employee.first_name = first_name;
    if (last_name) employee.last_name = last_name;
    if (email) employee.email = email;
    if (phone) employee.phone = phone;
    if (position) employee.position = position;
    if (branch_id !== undefined) employee.branch_id = branch_id;
    await employee.save();
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.employee_id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    await employee.destroy();
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 