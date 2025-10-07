import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, limit: 10 }); 

  const fetchTasks = async (page = 1) => {
    if (!user || !token) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/tasks/task`, {
        params: { page, limit: pagination.limit },
      });
      
      // Assuming backend response contains { tasks, totalPages, currentPage }
      const { tasks: fetchedTasks, totalPages, currentPage } = response.data;

      setTasks(fetchedTasks || []);
      setPagination(prev => ({ 
        ...prev, 
        page: currentPage || page, 
        totalPages: totalPages || 1 
      }));

    } catch (err) {
      console.error('Error fetching tasks:', err);
      // Ensure we display an error message if fetch fails
      setError(err.response?.data?.message || 'Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks(pagination.page);
    } else {
      setTasks([]);
      setPagination({ page: 1, totalPages: 1, limit: 10 });
    }
  }, [user, token]);

  const setPage = (page) => {
    setPagination(prev => ({ ...prev, page }));
    fetchTasks(page); 
  };
  
  const addTask = async (taskData) => {
    try {
      const response = await api.post('/tasks/add-task', taskData);
      await fetchTasks(pagination.page); 
      
      return response.data.task;

    } catch (err) {
      console.error('Error adding task:', err);
      throw err.response?.data?.message || 'Failed to add task.';
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const response = await api.put(`/tasks/update-task/${taskId}`, updates);
      const updatedTask = response.data.task;

      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? updatedTask : task
        )
      );

      return updatedTask;

    } catch (err) {
      console.error('Error updating task:', err);
      throw err.response?.data?.message || 'Failed to update task.';
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await api.delete(`/tasks/delete-task/${taskId}`);
      
      // Update local state: remove the deleted task
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));

      // Optional: If the current page is now empty, fetch the previous page
      if (tasks.length === 1 && pagination.page > 1) {
          fetchTasks(pagination.page - 1);
      } else {
          // If we deleted the only item on the page, re-fetch the current page to fill it
          fetchTasks(pagination.page);
      }
      
      return response.data.task;
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err.response?.data?.message || 'Failed to delete task.';
    }
  };

  const value = {
    tasks,
    loading,
    error,
    pagination,
    fetchTasks,
    setPage,
    addTask,
    updateTask,
    deleteTask,
    ...taskActions
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};