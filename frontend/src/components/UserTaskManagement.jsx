import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserTasks, addUserTasks, updateUserTasks, deleteUserTasks } from '../services/api';

const getPriorityClasses = (priority, type = 'chip') => {
  const baseChip = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider';
  const baseCard = 'border rounded-xl p-5 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-0.5';

  switch (priority) {
    case 'High':
      return type === 'chip' 
        ? `${baseChip} bg-red-600 text-white` 
        : `${baseCard} bg-red-50 border-red-500`;
    case 'Medium':
      return type === 'chip' 
        ? `${baseChip} bg-amber-500 text-white` 
        : `${baseCard} bg-amber-50 border-amber-500`;
    case 'Low':
      return type === 'chip' 
        ? `${baseChip} bg-emerald-500 text-white` 
        : `${baseCard} bg-emerald-50 border-emerald-500`;
    default:
      return type === 'chip' 
        ? `${baseChip} bg-gray-500 text-white` 
        : `${baseCard} bg-gray-50 border-gray-400`;
  }
};

const UserTasksManagement = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    try {
      const response = await getUserTasks(userId); 
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold text-indigo-600">
        Loading User Tasks...
      </div>
    );
  }

  return (
    <div className="p-5 max-w-7xl mx-auto sm:p-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-4 border-b-2 border-gray-200 gap-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-700">
          Tasks for User: <span className="text-gray-700 font-semibold">{userId}</span>
        </h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={() => navigate('/admin')} 
            className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold transition duration-200 hover:bg-gray-600 flex-grow sm:flex-grow-0 text-sm sm:text-base shadow-md"
          >
            Back to Users
          </button>
          <button 
            onClick={() => openModal()} 
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold transition duration-200 hover:bg-emerald-600 flex-grow sm:flex-grow-0 text-sm sm:text-base shadow-md"
          >
            + Add New Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tasks.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 text-lg p-12 bg-white rounded-xl shadow-inner">
            This user has no tasks.
          </p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className={getPriorityClasses(task.priority, 'card')}>
              <h3 className="text-xl font-bold text-indigo-600 mb-2">{task.title}</h3>
              
              <span className={getPriorityClasses(task.priority, 'chip')}>
                {task.priority}
              </span>

              <p className="text-gray-700 italic text-sm my-4 overflow-hidden max-h-[4.5em] line-clamp-3">
                {task.description}
              </p>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start pt-3 mb-4 border-t border-gray-200 text-sm">
                <p className="text-gray-600 mb-1 sm:mb-0">
                  <strong className="font-bold text-gray-700 mr-1">Status:</strong> {task.status}
                </p>
                <p className="text-gray-600">
                  <strong className="font-bold text-gray-700 mr-1">Due:</strong>{' '}
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
                </p>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
                <button
                  onClick={() => openModal(task)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium transition duration-150 hover:bg-indigo-700 flex-grow shadow-md"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(task._id)}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium transition duration-150 hover:bg-pink-700 flex-grow shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in">
          <div className="bg-white p-6 sm:p-8 rounded-xl w-full max-w-md shadow-2xl animate-slide-in">
            <h2 className="text-xl font-semibold text-indigo-600 mb-5 pb-2 border-b border-gray-200">
              {editingTask ? 'Edit Task' : 'Add Task'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 h-20 transition duration-150 outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 outline-none"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium transition duration-150 hover:bg-gray-300 flex-grow sm:flex-grow-0"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium transition duration-150 hover:bg-emerald-600 flex-grow sm:flex-grow-0"
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
        .line-clamp-3 { 
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
        }
      `}</style>
    </div>
  );
};

export default UserTasksManagement;
