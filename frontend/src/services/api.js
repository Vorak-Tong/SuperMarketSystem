import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const downloadFullBackup = async () => {
  const token = localStorage.getItem('token');
  const response = await api.post('/backup/full', null, {
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // Extract filename from content-disposition header if present
  const disposition = response.headers['content-disposition'];
  let filename = 'backup.sql';
  if (disposition && disposition.indexOf('filename=') !== -1) {
    filename = disposition.split('filename=')[1].replace(/['"]/g, '');
  }
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const fetchTotalSales = async () => {
  const response = await api.get('/order-items/total-sales');
  return response.data;
};

export const fetchTopProducts = async (limit = 5) => {
  const response = await api.get(`/order-items/top-products?limit=${limit}`);
  return response.data;
};

export default api; 