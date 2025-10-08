import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserTasks, addUserTasks, updateUserTasks, deleteUserTasks } from '../services/api';

const UserTasksManagement = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: ''
  });

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const response = await getUserTasks(userId);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const openModal = (task = null) => {
    setIsModalOpen(true);
    if (task) {
      setEditingTask(task);
      setFormData({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    } else {
      resetForm();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      dueDate: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await updateUserTasks(userId, editingTask._id, formData);
      } else {
        await addUserTasks(userId, formData);
      }
      closeModal();
      fetchTasks();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteUserTasks(userId, taskId);
        fetchTasks();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#ffcdd2'; // Light Red
      case 'Medium':
        return '#fff9c4'; // Light Yellow
      case 'Low':
        return '#c8e6c9'; // Light Green
      default:
        return '#f5f5f5'; // Grey
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Tasks Management</h2>
      <button onClick={() => navigate('/admin')} style={{ marginBottom: '20px' }}>Back to Users</button>
      <button onClick={() => openModal()} style={{ marginLeft: '10px', marginBottom: '20px' }}>Add New Task</button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {tasks.map((task) => (
          <div key={task._id} style={{ 
            border: '1px solid #ccc', 
            borderRadius: '5px', 
            padding: '15px',
            backgroundColor: getPriorityColor(task.priority)
          }}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</p>
            <button onClick={() => openModal(task)}>Edit</button>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>{editingTask ? 'Edit Task' : 'Add Task'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
                required
                style={inputStyle}
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                style={inputStyle}
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                style={inputStyle}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                style={inputStyle}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                style={inputStyle}
              />
              <div>
                <button type="submit">{editingTask ? 'Update Task' : 'Add Task'}</button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  width: '300px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
};

export default UserTasksManagement;