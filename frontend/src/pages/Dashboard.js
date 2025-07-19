import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, itemsRes, productsRes, branchesRes] = await Promise.all([
        api.get('/orders'),
        api.get('/order-items'),
        api.get('/products'),
        api.get('/branches'),
      ]);
      setOrders(ordersRes.data);
      setOrderItems(itemsRes.data);
      setProducts(productsRes.data);
      setBranches(branchesRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Analytics calculations
  const totalOrders = orders.length;
  const totalSales = orderItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

  // Top products by sales
  const productSales = products.map(p => ({
    name: p.product_name,
    sales: orderItems.filter(i => i.product_id === p.product_id).reduce((sum, i) => sum + (i.unit_price * i.quantity), 0)
  })).sort((a, b) => b.sales - a.sales).slice(0, 5);

  // Top branches by sales
  const branchSales = branches.map(b => ({
    name: b.branch_name,
    sales: orders.filter(o => o.branch_id === b.branch_id).reduce((sum, o) => {
      return orderItems.filter(i => i.order_id === o.order_id).reduce((s, i) => s + (i.unit_price * i.quantity), 0);
    }, 0)
  })).sort((a, b) => b.sales - a.sales).slice(0, 5);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Welcome, {user?.username}!</Typography>
      <Typography variant="body1" mb={2}>Role: {user?.role_name}</Typography>
      {loading ? <CircularProgress /> : error ? <Typography color="error">{error}</Typography> : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{totalOrders}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Total Sales</Typography>
              <Typography variant="h4">${totalSales.toFixed(2)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Top Product</Typography>
              <Typography variant="h4">{productSales[0]?.name || '-'}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" mb={2}>Top 5 Products by Sales</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={productSales} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#8884d8">
                    {productSales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" mb={2}>Top 5 Branches by Sales</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={branchSales} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {branchSales.map((entry, index) => (
                      <Cell key={`cellb-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard; 