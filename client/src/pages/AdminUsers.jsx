import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/api.js';
import { useAuth } from '../context/useAuth.js';

function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/users');
        setUsers(response.data.users || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return users;
    }

    return users.filter((user) => {
      const fullName = user.fullName?.toLowerCase() || '';
      const email = user.email?.toLowerCase() || '';
      const role = user.role?.toLowerCase() || '';

      return fullName.includes(searchText) || email.includes(searchText) || role.includes(searchText);
    });
  }, [search, users]);

  const handleRoleChange = async (userId, newRole) => {
    const selectedUser = users.find((user) => user._id === userId);

    if (!selectedUser || selectedUser.role === newRole) {
      return;
    }

    const confirmed = window.confirm(`Change ${selectedUser.fullName}'s role to ${newRole}?`);

    if (!confirmed) {
      return;
    }

    setMessage('');
    setError('');

    try {
      const response = await api.put(`/users/${userId}/role`, { role: newRole });
      const updatedUser = response.data.user;

      setUsers((currentUsers) =>
        currentUsers.map((user) => (user._id === userId ? { ...user, role: updatedUser.role } : user)),
      );
      setMessage('User role updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    const selectedUser = users.find((user) => user._id === userId);

    if (!selectedUser) {
      return;
    }

    const confirmed = window.confirm(`Delete ${selectedUser.fullName}? This action cannot be undone.`);

    if (!confirmed) {
      return;
    }

    setMessage('');
    setError('');

    try {
      await api.delete(`/users/${userId}`);
      setUsers((currentUsers) => currentUsers.filter((user) => user._id !== userId));
      setMessage('User deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <section className="page">
      <div className="admin-users-container">
        <div className="page-heading-row">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>User Management</h1>
            <p>View users, update roles, and remove accounts when needed.</p>
          </div>
        </div>

        <input
          className="admin-search-input"
          type="search"
          placeholder="Search by name, email, or role"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        {loading && <p>Loading users...</p>}

        {!loading && !error && filteredUsers.length === 0 && (
          <div className="empty-state">
            <p>No users found.</p>
          </div>
        )}

        {!loading && filteredUsers.length > 0 && (
          <div className="admin-users-table-wrap">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const currentUserId = currentUser?.id || currentUser?._id;
                  const isCurrentAdmin = user._id === currentUserId;

                  return (
                    <tr key={user._id}>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || 'Not provided'}</td>
                      <td>
                        <select
                          className="role-select"
                          value={user.role}
                          onChange={(event) => handleRoleChange(user._id, event.target.value)}
                        >
                          <option value="user">user</option>
                          <option value="agent">agent</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}</td>
                      <td>
                        {isCurrentAdmin ? (
                          <button className="button danger-button" type="button" disabled>
                            Current Admin
                          </button>
                        ) : (
                          <button className="button danger-button" type="button" onClick={() => handleDeleteUser(user._id)}>
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminUsers;
