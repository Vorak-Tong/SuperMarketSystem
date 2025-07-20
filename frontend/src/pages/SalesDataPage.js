import React, { useEffect, useState, useContext } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Alert, CircularProgress, TablePagination
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { useSnackbar } from 'notistack';

const emptyOrder = { customer_id: '', branch_id: '', order_date: '' };
const emptyOrderItem = { product_id: '', quantity: '', unit_price: '' };

const SalesDataPage = () => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const isEditor = user && (user.role_name === 'Administrator' || user.role_name === 'Backend Developer');
  const [orders, setOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form, setForm] = useState(emptyOrder);
  // Order details
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [payment, setPayment] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  // Order item dialog
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState(emptyOrderItem);
  // Pagination
  const [page, setPage] = useState(0); // zero-based for TablePagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [customerPage, setCustomerPage] = useState(0);
  const [customerRowsPerPage, setCustomerRowsPerPage] = useState(10);
  const [branchPage, setBranchPage] = useState(0);
  const [branchRowsPerPage, setBranchRowsPerPage] = useState(10);
  const [productPage, setProductPage] = useState(0);
  const [productRowsPerPage, setProductRowsPerPage] = useState(10);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalBranches, setTotalBranches] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchOrders(page, rowsPerPage);
  }, [page, rowsPerPage]);
  useEffect(() => {
    fetchCustomers(customerPage, customerRowsPerPage);
  }, [customerPage, customerRowsPerPage]);
  useEffect(() => {
    fetchBranches(branchPage, branchRowsPerPage);
  }, [branchPage, branchRowsPerPage]);
  useEffect(() => {
    fetchProducts(productPage, productRowsPerPage);
  }, [productPage, productRowsPerPage]);

  const fetchOrders = async (pageArg = page, limitArg = rowsPerPage) => {
    setLoading(true);
    try {
      const res = await api.get(`/orders?page=${pageArg + 1}&limit=${limitArg}`);
      setOrders(res.data.data || res.data || []);
      setTotal(res.data.total || (Array.isArray(res.data) ? res.data.length : 0));
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async (pageArg = branchPage, limitArg = branchRowsPerPage) => {
    try {
      const res = await api.get(`/branches?page=${pageArg + 1}&limit=${limitArg}`);
      setBranches(res.data.data || res.data || []);
      setTotalBranches(res.data.total || 0);
    } catch (err) {
      setBranches([]);
    }
  };

  const fetchCustomers = async (pageArg = customerPage, limitArg = customerRowsPerPage) => { // default to large limit if not paginating customers here
    try {
      const res = await api.get(`/customers?page=${pageArg + 1}&limit=${limitArg}`);
      setCustomers(res.data.data || []);
      setTotalCustomers(res.data.total || 0);
    } catch (err) {
      setCustomers([]);
    }
  };

  const fetchProducts = async (pageArg = productPage, limitArg = productRowsPerPage) => {
    try {
      const res = await api.get(`/products?page=${pageArg + 1}&limit=${limitArg}`);
      setProducts(res.data.data || res.data || []);
      setTotalProducts(res.data.total || 0);
    } catch (err) {
      setProducts([]);
    }
  };

  // Order CRUD
  const handleOpenDialog = (order = null) => {
    setEditingOrder(order);
    setForm(order ? { ...order } : emptyOrder);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingOrder(null);
    setForm(emptyOrder);
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOrder) {
        await api.put(`/orders/${editingOrder.order_id}`, form);
        enqueueSnackbar('Order updated', { variant: 'success' });
      } else {
        await api.post('/orders', form);
        enqueueSnackbar('Order added', { variant: 'success' });
      }
      fetchOrders();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save order');
      enqueueSnackbar('Failed to save order', { variant: 'error' });
    }
  };

  const handleDelete = async (order_id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await api.delete(`/orders/${order_id}`);
      fetchOrders();
      enqueueSnackbar('Order deleted', { variant: 'success' });
    } catch (err) {
      setError('Failed to delete order');
      enqueueSnackbar('Failed to delete order', { variant: 'error' });
    }
  };

  // Order details
  const handleOpenDetails = async (order) => {
    setDetailsOpen(true);
    setOrderLoading(true);
    try {
      const itemsRes = await api.get(`/order-items?order_id=${order.order_id}`);
      setOrderItems(itemsRes.data.filter(i => i.order_id === order.order_id));
      const paymentRes = await api.get('/payments');
      setPayment(paymentRes.data.find(p => p.order_id === order.order_id));
      setEditingOrder(order);
    } catch (err) {
      setOrderItems([]);
      setPayment(null);
    } finally {
      setOrderLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setEditingOrder(null);
    setOrderItems([]);
    setPayment(null);
  };

  // Order item CRUD
  const handleOpenItemDialog = (item = null) => {
    setEditingItem(item);
    setItemForm(item ? { ...item } : { ...emptyOrderItem, order_id: editingOrder.order_id });
    setItemDialogOpen(true);
  };

  const handleCloseItemDialog = () => {
    setItemDialogOpen(false);
    setEditingItem(null);
    setItemForm(emptyOrderItem);
    setError('');
  };

  const handleItemChange = (e) => {
    setItemForm({ ...itemForm, [e.target.name]: e.target.value });
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/order-items/${editingOrder.order_id}/${editingItem.product_id}`, itemForm);
        enqueueSnackbar('Order item updated', { variant: 'success' });
      } else {
        await api.post('/order-items', itemForm);
        enqueueSnackbar('Order item added', { variant: 'success' });
      }
      handleOpenDetails(editingOrder);
      handleCloseItemDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save order item');
      enqueueSnackbar('Failed to save order item', { variant: 'error' });
    }
  };

  const handleDeleteItem = async (product_id) => {
    if (!window.confirm('Delete this order item?')) return;
    try {
      await api.delete(`/order-items/${editingOrder.order_id}/${product_id}`);
      handleOpenDetails(editingOrder);
      enqueueSnackbar('Order item deleted', { variant: 'success' });
    } catch (err) {
      setError('Failed to delete order item');
      enqueueSnackbar('Failed to delete order item', { variant: 'error' });
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>Sales Data (Orders)</Typography>
      {isEditor && (
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => handleOpenDialog()}>
          Add Order
        </Button>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TableContainer component={Paper} sx={{ maxWidth: '100vw', overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Details</TableCell>
              {isEditor && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.order_id}>
                <TableCell>{o.order_id}</TableCell>
                <TableCell>{o.customer?.first_name || o.customer_id}</TableCell>
                <TableCell>{o.branch?.branch_name || o.branch_id}</TableCell>
                <TableCell>{o.order_date}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDetails(o)}><Visibility /></IconButton>
                </TableCell>
                {isEditor && (
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(o)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(o.order_id)}><Delete /></IconButton>
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
      {/* Order CRUD Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingOrder ? 'Edit Order' : 'Add Order'}</DialogTitle>
        <DialogContent>
          <form id="order-form" onSubmit={handleSubmit}>
            <TextField
              label="Customer"
              name="customer_id"
              select
              SelectProps={{ native: true }}
              value={form.customer_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c.customer_id} value={c.customer_id}>{c.first_name} {c.last_name}</option>
              ))}
            </TextField>
            <TextField
              label="Branch"
              name="branch_id"
              select
              SelectProps={{ native: true }}
              value={form.branch_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            >
              <option value="">Select branch</option>
              {branches.map((b) => (
                <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>
              ))}
            </TextField>
            <TextField
              label="Order Date"
              name="order_date"
              type="datetime-local"
              value={form.order_date}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button type="submit" form="order-form" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {orderLoading ? <CircularProgress /> : (
            <>
              <Typography variant="h6" mt={2}>Order Items</Typography>
              {isEditor && (
                <Button variant="contained" size="small" sx={{ mb: 1 }} onClick={() => handleOpenItemDialog()}>
                  Add Item
                </Button>
              )}
              <TableContainer sx={{ maxWidth: '100vw', overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit Price</TableCell>
                      {isEditor && <TableCell>Actions</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.product_id}>
                        <TableCell>{products.find(p => p.product_id === item.product_id)?.product_name || item.product_id}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unit_price}</TableCell>
                        {isEditor && (
                          <TableCell>
                            <IconButton onClick={() => handleOpenItemDialog(item)}><Edit /></IconButton>
                            <IconButton onClick={() => handleDeleteItem(item.product_id)}><Delete /></IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="h6" mt={3}>Payment</Typography>
              {payment ? (
                <Box>
                  <Typography>Method: {payment.payment_method}</Typography>
                  <Typography>Date: {payment.payment_date}</Typography>
                </Box>
              ) : (
                <Typography>No payment info.</Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Order Item Dialog */}
      <Dialog open={itemDialogOpen} onClose={handleCloseItemDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingItem ? 'Edit Order Item' : 'Add Order Item'}</DialogTitle>
        <DialogContent>
          <form id="item-form" onSubmit={handleItemSubmit}>
            <TextField
              label="Product"
              name="product_id"
              select
              SelectProps={{ native: true }}
              value={itemForm.product_id}
              onChange={handleItemChange}
              fullWidth
              margin="normal"
              required
              disabled={!!editingItem}
            >
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.product_id} value={p.product_id}>{p.product_name}</option>
              ))}
            </TextField>
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={itemForm.quantity}
              onChange={handleItemChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Unit Price"
              name="unit_price"
              type="number"
              value={itemForm.unit_price}
              onChange={handleItemChange}
              fullWidth
              margin="normal"
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseItemDialog}>Cancel</Button>
          <Button type="submit" form="item-form" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      <TablePagination
        component="div"
        count={totalCustomers}
        page={customerPage}
        onPageChange={(e, newPage) => setCustomerPage(newPage)}
        rowsPerPage={customerRowsPerPage}
        onRowsPerPageChange={e => { setCustomerRowsPerPage(parseInt(e.target.value, 10)); setCustomerPage(0); }}
      />
      <TableContainer component={Paper} sx={{ maxWidth: '100vw', overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Customer ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              {isEditor && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.customer_id}>
                <TableCell>{c.customer_id}</TableCell>
                <TableCell>{c.first_name}</TableCell>
                <TableCell>{c.last_name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>
                {isEditor && (
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog({ customer_id: c.customer_id, branch_id: '', order_date: '' })}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(c.customer_id)}><Delete /></IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalBranches}
        page={branchPage}
        onPageChange={(e, newPage) => setBranchPage(newPage)}
        rowsPerPage={branchRowsPerPage}
        onRowsPerPageChange={e => { setBranchRowsPerPage(parseInt(e.target.value, 10)); setBranchPage(0); }}
      />
      <TableContainer component={Paper} sx={{ maxWidth: '100vw', overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Branch ID</TableCell>
              <TableCell>Branch Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Phone</TableCell>
              {isEditor && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {branches.map((b) => (
              <TableRow key={b.branch_id}>
                <TableCell>{b.branch_id}</TableCell>
                <TableCell>{b.branch_name}</TableCell>
                <TableCell>{b.location}</TableCell>
                <TableCell>{b.phone}</TableCell>
                {isEditor && (
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog({ customer_id: '', branch_id: b.branch_id, order_date: '' })}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(b.branch_id)}><Delete /></IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalProducts}
        page={productPage}
        onPageChange={(e, newPage) => setProductPage(newPage)}
        rowsPerPage={productRowsPerPage}
        onRowsPerPageChange={e => { setProductRowsPerPage(parseInt(e.target.value, 10)); setProductPage(0); }}
      />
      <TableContainer component={Paper} sx={{ maxWidth: '100vw', overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Supplier</TableCell>
              {isEditor && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.product_id}>
                <TableCell>{p.product_id}</TableCell>
                <TableCell>{p.product_name}</TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>{p.category?.category_name || p.category_id}</TableCell>
                <TableCell>{p.supplier}</TableCell>
                {isEditor && (
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog({ customer_id: '', branch_id: '', order_date: '', product_id: p.product_id })}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(p.product_id)}><Delete /></IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SalesDataPage; 