import Product from '../models/product.js';
import ProductCategory from '../models/product_category.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ include: [{ model: ProductCategory, as: 'category' }] });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.product_id, { include: [{ model: ProductCategory, as: 'category' }] });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create product
export const createProduct = async (req, res) => {
  const { product_name, price, category_id, brand } = req.body;
  try {
    const product = await Product.create({ product_name, price, category_id, brand });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.product_id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const { product_name, price, category_id, brand } = req.body;
    if (product_name) product.product_name = product_name;
    if (price) product.price = price;
    if (category_id) product.category_id = category_id;
    if (brand) product.brand = brand;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.product_id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 