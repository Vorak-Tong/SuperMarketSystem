import React, { useEffect, useState, useContext } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Alert
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { useSnackbar } from 'notistack';

const emptyProduct = { product_name: '', price: '', category_id: '', brand: '' };

const ProductsPage = () => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const isEditor = user && (user.role_name === 'Administrator' || user.role_name === 'Backend Developer');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyProduct);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      setCategories([]);
    }
  };

  const handleOpenDialog = (product = null) => {
    setEditingProduct(product);
    setForm(product ? { ...product } : emptyProduct);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setForm(emptyProduct);
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.product_id}`, form);
        enqueueSnackbar('Product updated', { variant: 'success' });
      } else {
        await api.post('/products', form);
        enqueueSnackbar('Product added', { variant: 'success' });
      }
      fetchProducts();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
      enqueueSnackbar('Failed to save product', { variant: 'error' });
    }
  };

  const handleDelete = async (product_id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${product_id}`);
      fetchProducts();
      enqueueSnackbar('Product deleted', { variant: 'success' });
    } catch (err) {
      setError('Failed to delete product');
      enqueueSnackbar('Failed to delete product', { variant: 'error' });
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>Products</Typography>
      {isEditor && (
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => handleOpenDialog()}>
          Add Product
        </Button>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TableContainer component={Paper} sx={{ maxWidth: '100vw', overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              {isEditor && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.product_id}>
                <TableCell>{p.product_name}</TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>{p.category?.category_name || p.category_id}</TableCell>
                <TableCell>{p.brand}</TableCell>
                {isEditor && (
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(p)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(p.product_id)}><Delete /></IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <form id="product-form" onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="product_name"
              value={form.product_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Category"
              name="category_id"
              select
              SelectProps={{ native: true }}
              value={form.category_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
              ))}
            </TextField>
            <TextField
              label="Brand"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button type="submit" form="product-form" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsPage; 