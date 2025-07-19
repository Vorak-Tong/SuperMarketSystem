import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import SalesDataPage from './pages/SalesDataPage';
import UserManagementPage from './pages/UserManagementPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedNav from './components/RoleBasedNav';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import SignupPage from './pages/SignupPage';
import CustomersPage from './pages/CustomersPage';
import RestockOrdersPage from './pages/RestockOrdersPage';
import RestockItemsPage from './pages/RestockItemsPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#ff9800' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <AuthProvider>
          <Router>
            <RoleBasedNav />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
              <Route path="/sales" element={<ProtectedRoute><SalesDataPage /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
              <Route path="/restock-orders" element={<ProtectedRoute><RestockOrdersPage /></ProtectedRoute>} />
              <Route path="/restock-items" element={<ProtectedRoute><RestockItemsPage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Router>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
