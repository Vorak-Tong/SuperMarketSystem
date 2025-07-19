import React, { useEffect, useState, useContext } from 'react';
import {
  getRestockOrders,
  getRestockOrder,
  createRestockOrder,
  updateRestockOrder,
  deleteRestockOrder
} from '../services/restockOrders';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import AuthContext from '../context/AuthContext';

const emptyOrder = { supplier_id: '', branch_id: '', order_date: '', status: '' };

function RestockOrdersPage() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyOrder);
  const [selectedId, setSelectedId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const canEdit = user && (user.role_name === 'Administrator' || user.role_name === 'Backend Developer');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getRestockOrders();
      setOrders(res.data);
    } catch (err) {
      enqueueSnackbar('Failed to fetch restock orders', { variant: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleOpen = (order = emptyOrder) => {
    setForm(order);
    setEditMode(!!order.restock_order_id);
    setSelectedId(order.restock_order_id || null);
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setForm(emptyOrder); setSelectedId(null); };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updateRestockOrder(selectedId, form);
        enqueueSnackbar('Restock order updated', { variant: 'success' });
      } else {
        await createRestockOrder(form);
        enqueueSnackbar('Restock order created', { variant: 'success' });
      }
      fetchOrders();
      handleClose();
    } catch {
      enqueueSnackbar('Operation failed', { variant: 'error' });
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this restock order?')) return;
    try {
      await deleteRestockOrder(id);
      enqueueSnackbar('Restock order deleted', { variant: 'success' });
      fetchOrders();
    } catch {
      enqueueSnackbar('Delete failed', { variant: 'error' });
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Restock Orders</h2>
      {canEdit && <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Add Restock Order</Button>}
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Supplier ID</TableCell>
                <TableCell>Branch ID</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Status</TableCell>
                {canEdit && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(o => (
                <TableRow key={o.restock_order_id}>
                  <TableCell>{o.supplier_id}</TableCell>
                  <TableCell>{o.branch_id}</TableCell>
                  <TableCell>{o.order_date}</TableCell>
                  <TableCell>{o.status}</TableCell>
                  {canEdit && <TableCell>
                    <IconButton onClick={() => handleOpen(o)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(o.restock_order_id)}><Delete /></IconButton>
                  </TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Restock Order' : 'Add Restock Order'}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Supplier ID" name="supplier_id" value={form.supplier_id} onChange={handleChange} fullWidth />
          <TextField margin="dense" label="Branch ID" name="branch_id" value={form.branch_id} onChange={handleChange} fullWidth />
          <TextField margin="dense" label="Order Date" name="order_date" value={form.order_date} onChange={handleChange} fullWidth />
          <TextField margin="dense" label="Status" name="status" value={form.status} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editMode ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RestockOrdersPage; 