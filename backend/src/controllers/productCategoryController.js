import ProductCategory from '../models/product_category.js';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findByPk(req.params.category_id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createCategory = async (req, res) => {
  const { category_name } = req.body;
  try {
    const category = await ProductCategory.create({ category_name });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findByPk(req.params.category_id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    const { category_name } = req.body;
    if (category_name) category.category_name = category_name;
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findByPk(req.params.category_id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 