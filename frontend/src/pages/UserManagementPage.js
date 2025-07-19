import React, { useEffect, useState, useContext } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Alert, MenuItem
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { useSnackbar } from 'notistack';

const emptyUser = { username: '', password: '', role_id: '' };

const UserManagementPage = () => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const isAdmin = user && user.role_name === 'Administrator';
  const isEditor = isAdmin; // Only admin can add/edit/delete
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyUser);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await api.get('/roles');
      setRoles(res.data);
    } catch (err) {
      setRoles([]);
    }
  };

  const handleOpenDialog = (user = null) => {
    setEditingUser(user);
    setForm(user ? { ...user, password: '' } : emptyUser);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    setForm(emptyUser);
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/admin/users/${editingUser.user_id}`, form);
        enqueueSnackbar('User updated', { variant: 'success' });
      } else {
        await api.post('/admin/users', form);
        enqueueSnackbar('User added', { variant: 'success' });
      }
      fetchUsers();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user');
      enqueueSnackbar('Failed to save user', { variant: 'error' });
    }
  };

  const handleDelete = async (user_id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${user_id}`);
      fetchUsers();
      enqueueSnackbar('User deleted', { variant: 'success' });
    } catch (err) {
      setError('Failed to delete user');
      enqueueSnackbar('Failed to delete user', { variant: 'error' });
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>User Management</Typography>
      {isAdmin && (
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => handleOpenDialog()}>
          Add User
        </Button>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TableContainer component={Paper} sx={{ maxWidth: '100vw', overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              {isAdmin && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.user_id}>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.role?.role_name || u.role_id}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(u)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(u.user_id)}><Delete /></IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <form id="user-form" onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required={!editingUser}
              helperText={editingUser ? 'Leave blank to keep current password' : ''}
            />
            <TextField
              label="Role"
              name="role_id"
              select
              value={form.role_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            >
              <MenuItem value="">Select role</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.role_id} value={role.role_id}>{role.role_name}</MenuItem>
              ))}
            </TextField>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button type="submit" form="user-form" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagementPage; 