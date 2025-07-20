import React, { useEffect, useState, useContext } from 'react';
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../services/customers';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, TablePagination
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import AuthContext from '../context/AuthContext';

const emptyCustomer = { name: '', email: '', phone: '' };

function CustomersPage() {
  const { user } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyCustomer);
  const [selectedId, setSelectedId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0); // zero-based for TablePagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const canEdit = user && (user.role_name === 'Administrator' || user.role_name === 'Backend Developer');

  const fetchCustomers = async (pageArg = page, limitArg = rowsPerPage) => {
    setLoading(true);
    try {
      const res = await getCustomers(pageArg + 1, limitArg);
      setCustomers(res.data.data || res.data || []);
      setTotal(res.data.total || (Array.isArray(res.data) ? res.data.length : 0));
    } catch (err) {
      enqueueSnackbar('Failed to fetch customers', { variant: 'error' });
      setCustomers([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(page, rowsPerPage); }, [page, rowsPerPage]);

  const handleOpen = (customer = emptyCustomer) => {
    setForm(customer);
    setEditMode(!!customer.customer_id);
    setSelectedId(customer.customer_id || null);
    setOpen(true);
  };
  const handleClose = () => { setOpen(false); setForm(emptyCustomer); setSelectedId(null); };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updateCustomer(selectedId, form);
        enqueueSnackbar('Customer updated', { variant: 'success' });
      } else {
        await createCustomer(form);
        enqueueSnackbar('Customer created', { variant: 'success' });
      }
      fetchCustomers(page, rowsPerPage);
      handleClose();
    } catch {
      enqueueSnackbar('Operation failed', { variant: 'error' });
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await deleteCustomer(id);
      enqueueSnackbar('Customer deleted', { variant: 'success' });
      fetchCustomers(page, rowsPerPage);
    } catch {
      enqueueSnackbar('Delete failed', { variant: 'error' });
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Customers</h2>
      {canEdit && <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Add Customer</Button>}
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                {canEdit && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map(c => (
                <TableRow key={c.customer_id}>
                  <TableCell>{c.first_name} {c.last_name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  {canEdit && <TableCell>
                    <IconButton onClick={() => handleOpen(c)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(c.customer_id)}><Delete /></IconButton>
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
        <DialogTitle>{editMode ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
          <TextField margin="dense" label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
          <TextField margin="dense" label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editMode ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CustomersPage; 