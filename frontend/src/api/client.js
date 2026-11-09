import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 60000, // Gemini analysis can take a while
});

export const submitReport = (formData) => api.post('/report', formData).then((r) => r.data);
export const getTickets = () => api.get('/tickets').then((r) => r.data);
export const resolveTicket = (id) => api.patch(`/tickets/${id}/resolve`).then((r) => r.data);

export const errorMessage = (e) =>
  e.response?.data?.error || (e.code === 'ERR_NETWORK' ? 'Cannot reach the server. Is the backend running?' : e.message);
