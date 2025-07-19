import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { AppBar, Toolbar, Button, Box } from '@mui/material';

const RoleBasedNav = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="default" sx={{ mb: 2 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button component={Link} to="/" color="inherit">Dashboard</Button>
          <Button component={Link} to="/products" color="inherit">Products</Button>
          <Button component={Link} to="/sales" color="inherit">Sales Data</Button>
          <Button component={Link} to="/customers" color="inherit">Customers</Button>
          <Button component={Link} to="/restock-orders" color="inherit">Restock Orders</Button>
          <Button component={Link} to="/restock-items" color="inherit">Restock Items</Button>
          {(user.role_name === 'Administrator' || user.role_name === 'Backend Developer') && (
            <Button component={Link} to="/users" color="inherit">User Management</Button>
          )}
          <Button component={Link} to="/profile" color="inherit">Profile</Button>
        </Box>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default RoleBasedNav; 