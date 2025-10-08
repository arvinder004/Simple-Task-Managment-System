import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, addUserByAdmin, updateUserByAdmin, deleteUserByAdmin } from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const openModal = (user = null) => {
    setIsModalOpen(true);
    if (user) {
      setEditingUser(user);
      setFormData({ ...user, password: '' });
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

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>
      <button onClick={() => openModal()} style={{ marginBottom: '20px' }}>Add New User</button>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => openModal(user)}>Edit</button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
                <Link to={`/admin/user/${user._id}/tasks`}>
                  <button>Manage Tasks</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>{editingUser ? 'Edit User' : 'Add User'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                required
                style={inputStyle}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={editingUser ? 'New Password (optional)' : 'Password'}
                {...(editingUser ? {} : { required: true })}
                style={inputStyle}
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                style={inputStyle}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div>
                <button type="submit">{editingUser ? 'Update User' : 'Add User'}</button>
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

export default AdminDashboard;