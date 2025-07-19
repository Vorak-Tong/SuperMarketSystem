import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Box, TextField, Button, Typography, Alert, Paper, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(3);
  const [roles, setRoles] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch roles except Administrator
    api.get('/roles').then(res => {
      setRoles(res.data.filter(r => r.role_name !== 'Administrator'));
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/auth/signup', { username, password, role_id: roleId });
      setSuccess('Signup successful! You can now log in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" mb={2} align="center">Sign Up</Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} fullWidth margin="normal" required />
          <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth margin="normal" required />
          <TextField
            label="Role"
            select
            value={roleId}
            onChange={e => setRoleId(Number(e.target.value))}
            fullWidth
            margin="normal"
            required
          >
            {roles.map(role => (
              <MenuItem key={role.role_id} value={role.role_id}>{role.role_name}</MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default SignupPage; 