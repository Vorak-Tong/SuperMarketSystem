import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { Box, Typography, Paper, TextField, Button, Alert } from '@mui/material';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    try {
      await api.post('/users/change-password', { oldPassword, newPassword });
      setSuccess('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper elevation={2} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" mb={2}>Profile</Typography>
        <Typography variant="body1">Username: {user?.username}</Typography>
        <Typography variant="body1">Role: {user?.role_name}</Typography>
        <Box mt={3}>
          <Typography variant="h6" mb={1}>Change Password</Typography>
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleChangePassword}>
            <TextField
              label="Old Password"
              type="password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfilePage; 