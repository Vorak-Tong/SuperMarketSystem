import React, { useEffect, useState, useContext } from 'react';
import {
  getRestockItems,
  getRestockItem,
  createRestockItem,
  updateRestockItem,
  deleteRestockItem
} from '../services/restockItems';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, TablePagination
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import AuthContext from '../context/AuthContext';

const emptyItem = { restock_order_id: '', product_id: '', quantity: '' };

function RestockItemsPage() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyItem);
  const [selected, setSelected] = useState({ restock_order_id: null, product_id: null });
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0); // zero-based for TablePagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const canEdit = user && (user.role_name === 'Administrator' || user.role_name === 'Backend Developer');

  const fetchItems = async (pageArg = page, limitArg = rowsPerPage) => {
    setLoading(true);
    try {
      const res = await getRestockItems(pageArg + 1, limitArg);
      setItems(res.data.data || res.data || []);
      setTotal(res.data.total || (Array.isArray(res.data) ? res.data.length : 0));
    } catch (err) {
      enqueueSnackbar('Failed to fetch restock items', { variant: 'error' });
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(page, rowsPerPage); }, [page, rowsPerPage]);

  const handleOpen = (item = emptyItem) => {
    setForm(item);
    setEditMode(!!(item.restock_order_id && item.product_id));
    setSelected({
      restock_order_id: item.restock_order_id || null,
      product_id: item.product_id || null
    });
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setForm(emptyItem); setSelected({ restock_order_id: null, product_id: null }); };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updateRestockItem(selected.restock_order_id, selected.product_id, form);
        enqueueSnackbar('Restock item updated', { variant: 'success' });
      } else {
        await createRestockItem(form);
        enqueueSnackbar('Restock item created', { variant: 'success' });
      }
      fetchItems(page, rowsPerPage);
      handleClose();
    } catch {
      enqueueSnackbar('Operation failed', { variant: 'error' });
    }
  };

  const handleDelete = async (restock_order_id, product_id) => {
    if (!window.confirm('Delete this restock item?')) return;
    try {
      await deleteRestockItem(restock_order_id, product_id);
      enqueueSnackbar('Restock item deleted', { variant: 'success' });
      fetchItems(page, rowsPerPage);
    } catch {
      enqueueSnackbar('Delete failed', { variant: 'error' });
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Restock Items</h2>
      {canEdit && <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Add Restock Item</Button>}
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Restock Order ID</TableCell>
                <TableCell>Product ID</TableCell>
                <TableCell>Quantity</TableCell>
                {canEdit && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(i => (
                <TableRow key={i.restock_order_id + '-' + i.product_id}>
                  <TableCell>{i.restock_order_id}</TableCell>
                  <TableCell>{i.product_id}</TableCell>
                  <TableCell>{i.quantity}</TableCell>
                  {canEdit && <TableCell>
                    <IconButton onClick={() => handleOpen(i)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(i.restock_order_id, i.product_id)}><Delete /></IconButton>
                  </TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Restock Item' : 'Add Restock Item'}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Restock Order ID" name="restock_order_id" value={form.restock_order_id} onChange={handleChange} fullWidth />
          <TextField margin="dense" label="Product ID" name="product_id" value={form.product_id} onChange={handleChange} fullWidth />
          <TextField margin="dense" label="Quantity" name="quantity" value={form.quantity} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editMode ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RestockItemsPage; 