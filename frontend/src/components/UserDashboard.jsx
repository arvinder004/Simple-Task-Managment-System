import React, { useState, useEffect } from 'react';
import { getTasks, addTask, updateTask, deleteTask } from '../services/api';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await getTasks();
      setTasks(data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { title, description };
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
      } else {
        await addTask(taskData);
      }
      resetForm();
      fetchTasks();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEditingTask(null);
  };

  return (
    <div>
      <h2>My Tasks</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ marginRight: '10px' }}
        />
        <button type="submit">{editingTask ? 'Update Task' : 'Add Task'}</button>
        {editingTask && <button onClick={resetForm} style={{ marginLeft: '10px' }}>Cancel</button>}
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} style={{ marginBottom: '10px' }}>
            <strong>{task.title}</strong>: {task.description} ({task.status})
            <button onClick={() => handleEdit(task)} style={{ marginLeft: '10px' }}>Edit</button>
            <button onClick={() => handleDelete(task._id)} style={{ marginLeft: '10px' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;