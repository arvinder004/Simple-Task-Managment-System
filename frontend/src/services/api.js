import axios from 'axios';

const API = axios.create({baseURL: 'https://simple-task-managment-system.onrender.com/api', headers: {
    'Content-Type': 'application/json',
  },});
API.interceptors.request.use((req) => {
  console.log('API Request:', req.method, req.url);
  if (localStorage.getItem('token')) {
    req.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.message, err.code, err.response?.status);
    return Promise.reject(err);
  }
);

// Authentication Routes
export const signin = (formData) => API.post('/auth/login', formData)
export const signup = (formData) => API.post('/auth/register', formData);

// Task Routes
export const getTasks = () => API.get('/tasks/task');
export const addTask = (taskData) => API.post('/tasks/add-task', taskData);
export const updateTask = (id, taskData) => API.put(`/tasks/update-task/${id}`, taskData);
export const deleteTask = (id) => API.delete(`/tasks/delete-task/${id}`);

// Admin Routes
export const getAllUsers = () => API.get('/admin/view-users');
export const addUserByAdmin = (userData) => API.post('/admin/add-user', userData);
export const updateUserByAdmin = (userId, userData) => API.put(`/admin/update-user/${userId}`, userData);
export const deleteUserByAdmin = (userId) => API.delete(`/admin/delete-user/${userId}`);

export const getUserTasks = (userId) => API.get(`/admin/user/${userId}/tasks`);
export const addUserTasks = (userId, userData) => API.post(`/admin/user/${userId}/tasks`, userData)
export const updateUserTasks = (userId, taskId, userData) => API.put(`/admin/user/${userId}/tasks/${taskId}`, userData)
export const deleteUserTasks = (userId, taskId, userData) => API.delete(`/admin/user/${userId}/tasks/${taskId}`, userData)

export default API;