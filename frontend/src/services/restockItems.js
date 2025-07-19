import api from './api';

export const getRestockItems = () => api.get('/restock-items');
export const getRestockItem = (restock_order_id, product_id) => api.get(`/restock-items/${restock_order_id}/${product_id}`);
export const createRestockItem = (data) => api.post('/restock-items', data);
export const updateRestockItem = (restock_order_id, product_id, data) => api.put(`/restock-items/${restock_order_id}/${product_id}`, data);
export const deleteRestockItem = (restock_order_id, product_id) => api.delete(`/restock-items/${restock_order_id}/${product_id}`); 