import React, { useState, useEffect } from 'react';
import ModalPortal from './ModalPortal';
import { Link } from 'react-router-dom';
import { getAllUsers, addUserByAdmin, updateUserByAdmin, deleteUserByAdmin } from '../services/api';

const getRoleTagClasses = (role) => {
  const base = 'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider';
  return role === 'admin'
    ? `${base} bg-red-100 text-red-600`
    : `${base} bg-blue-100 text-blue-600`;
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
        setLoading(false);
    }
  };

  const openModal = (user = null) => {
    setIsModalOpen(true);
    if (user) {
      setEditingUser(user);
      setFormData({ username: user.username, password: '', role: user.role }); 
    } else {
      resetForm();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({ username: '', password: '', role: 'user' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      if (editingUser && !dataToSend.password) {
        delete dataToSend.password;
      }
      if (editingUser) {
        await updateUserByAdmin(editingUser._id, dataToSend);
      } else {
        await addUserByAdmin(dataToSend);
      }
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserByAdmin(id);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold text-indigo-600">
        Loading Users...
      </div>
    );
  }

  return (
    <div className="p-5 max-w-6xl mx-auto sm:p-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-4 border-b-2 border-gray-100 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-600">
          Admin Dashboard
        </h2>
        <button 
            onClick={() => openModal()} 
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold transition duration-200 hover:bg-emerald-600 shadow-md hover:shadow-lg text-sm sm:text-base w-full sm:w-auto"
        >
            + Add New User
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {users.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 text-lg p-12">
                No users found. Add a new user to get started.
            </p>
        ) : (
            users.map((user) => (
                <div key={user._id} className="border border-gray-200 rounded-xl p-5 bg-white shadow-lg flex flex-col justify-between transition duration-300 hover:shadow-xl">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                        <div className="text-xl font-bold text-indigo-600">
                            {user.username}
                        </div>
                        <span className={getRoleTagClasses(user.role)}>{user.role}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                        <button 
                            onClick={() => openModal(user)} 
                            className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium transition duration-150 hover:bg-indigo-700 active:translate-y-px flex-grow sm:flex-grow-0"
                        >
                            Edit
                        </button>
                        <button 
                            onClick={() => handleDelete(user._id)} 
                            className="px-3 py-2 bg-pink-600 text-white rounded-md text-sm font-medium transition duration-150 hover:bg-pink-700 active:translate-y-px flex-grow sm:flex-grow-0"
                        >
                            Delete
                        </button>
                        <Link to={`/admin/user/${user._id}/tasks`} className="flex-grow sm:flex-grow-0">
                            <button 
                                className="px-3 py-2 bg-green-500 text-white rounded-md text-sm font-medium transition duration-150 hover:bg-green-600 active:translate-y-px w-full"
                            >
                                Manage Tasks
                            </button>
                        </Link>
                    </div>
                </div>
            ))
        )}
      </div>

      {isModalOpen && (
        <ModalPortal>
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[9999] p-4 transition-opacity duration-300">
          <div className="bg-white p-6 sm:p-8 rounded-xl w-full max-w-md shadow-2xl transition-transform duration-300 relative z-[10000]">
            <h2 className="text-xl font-semibold text-indigo-600 mb-5 pb-2 border-b border-gray-100">
              {editingUser ? 'Edit User' : 'Add User'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={editingUser ? 'New Password (optional)' : 'Password'}
                  {...(editingUser ? {} : { required: true })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4 border-t border-gray-100">
                <button 
                    type="submit" 
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium transition duration-150 hover:bg-emerald-600 flex-grow sm:flex-grow-0"
                >
                    {editingUser ? 'Update User' : 'Add User'}
                </button>
                <button 
                    type="button" 
                    onClick={closeModal} 
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium transition duration-150 hover:bg-gray-300 flex-grow sm:flex-grow-0"
                >
                    Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        </ModalPortal>
      )}
    </div>
  );
};

export default AdminDashboard;