import api from './api';

export const getRestockOrders = () => api.get('/restock-orders');
export const getRestockOrder = (id) => api.get(`/restock-orders/${id}`);
export const createRestockOrder = (data) => api.post('/restock-orders', data);
export const updateRestockOrder = (id, data) => api.put(`/restock-orders/${id}`, data);
export const deleteRestockOrder = (id) => api.delete(`/restock-orders/${id}`); 