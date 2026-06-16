import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api.js';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/dashboard/admin-stats');
        setStats(response.data.stats);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch admin dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers },
    { label: 'Admins', value: stats?.totalAdmins },
    { label: 'Agents', value: stats?.totalAgents },
    { label: 'Normal Users', value: stats?.totalNormalUsers },
    { label: 'Total Properties', value: stats?.totalProperties },
    { label: 'Available Properties', value: stats?.availableProperties },
    { label: 'Sold Properties', value: stats?.soldProperties },
    { label: 'Rented Properties', value: stats?.rentedProperties },
    { label: 'Total Inquiries', value: stats?.totalInquiries },
    { label: 'New Inquiries', value: stats?.newInquiries },
    { label: 'Contacted Inquiries', value: stats?.contactedInquiries },
    { label: 'Closed Inquiries', value: stats?.closedInquiries },
    { label: 'Total Favorites', value: stats?.totalFavorites },
  ];

  return (
    <section className="page">
      <div className="dashboard-container">
        <article className="welcome-card admin-welcome">
          <p className="eyebrow">Admin Dashboard</p>
          <h1>System Overview</h1>
          <p>Monitor users, listings, inquiries, and saved properties.</p>
        </article>

        {loading && <p>Loading admin dashboard statistics...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && stats && (
          <div className="stats-grid admin-stats-grid">
            {statCards.map((item) => (
              <article className="stat-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value ?? 0}</strong>
              </article>
            ))}
          </div>
        )}

        <section className="quick-actions">
          <h2>Admin Quick Actions</h2>
          <div className="quick-action-grid">
            <Link to="/admin/users" className="quick-action-card">
              Manage Users
            </Link>
            <Link to="/admin/inquiries" className="quick-action-card">
              Manage Inquiries
            </Link>
            <Link to="/properties" className="quick-action-card">
              View Properties
            </Link>
            <Link to="/dashboard" className="quick-action-card">
              My Dashboard
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}

export default AdminDashboard;
