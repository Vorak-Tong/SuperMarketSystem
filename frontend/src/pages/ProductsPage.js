import React, { useEffect, useState, useContext } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Alert, TablePagination
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { useSnackbar } from 'notistack';

const emptyProduct = { product_name: '', price: '', category_id: ''};

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
  const [page, setPage] = useState(0); // zero-based for TablePagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line
  }, [page, rowsPerPage]);

  const fetchProducts = async (pageArg = page, limitArg = rowsPerPage) => {
    setLoading(true);
    try {
      const res = await api.get(`/products?page=${pageArg + 1}&limit=${limitArg}`);
      setProducts(res.data.data || res.data || []);
      setTotal(res.data.total || (Array.isArray(res.data) ? res.data.length : 0));
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
    // Frontend validation
    if (!form.product_name || !form.price || !form.category_id) {
      setError('All fields are required.');
      enqueueSnackbar('All fields are required.', { variant: 'error' });
      return;
    }
    if (isNaN(Number(form.price)) || Number(form.price) < 0) {
      setError('Price must be a non-negative number.');
      enqueueSnackbar('Price must be a non-negative number.', { variant: 'error' });
      return;
    }
    const payload = {
      ...form,
      price: Number(form.price),
      category_id: Number(form.category_id),
    };
    console.log('Submitting product:', payload);
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.product_id}`, payload);
        enqueueSnackbar('Product updated', { variant: 'success' });
      } else {
        await api.post('/products', payload);
        enqueueSnackbar('Product added', { variant: 'success' });
      }
      fetchProducts(page, rowsPerPage);
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
      fetchProducts(page, rowsPerPage);
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
              {isEditor && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.product_id}>
                <TableCell>{p.product_name}</TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>{p.category?.category_name || p.category_id}</TableCell>
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
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
      />
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