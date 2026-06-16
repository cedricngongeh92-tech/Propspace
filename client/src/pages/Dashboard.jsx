import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/useAuth.js';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/dashboard/my-stats');
        setStats(response.data.stats);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'My Properties', value: stats?.totalMyProperties },
    { label: 'Available Properties', value: stats?.availableMyProperties },
    { label: 'Sold Properties', value: stats?.soldMyProperties },
    { label: 'Rented Properties', value: stats?.rentedMyProperties },
    { label: 'Inquiries Received', value: stats?.totalInquiriesReceived },
    { label: 'New Inquiries', value: stats?.newInquiriesReceived },
    { label: 'Saved Properties', value: stats?.totalSavedProperties },
  ];

  return (
    <section className="page">
      <div className="dashboard-container">
        <article className="welcome-card">
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome back, {user?.fullName}</h1>
          <p>{user?.email}</p>
          <p>Role: {user?.role}</p>
        </article>

        {loading && <p>Loading dashboard statistics...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && stats && (
          <div className="stats-grid">
            {statCards.map((item) => (
              <article className="stat-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value ?? 0}</strong>
              </article>
            ))}
          </div>
        )}

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-action-grid">
            <Link to="/properties/create" className="quick-action-card">
              Add Property
            </Link>
            <Link to="/my-properties" className="quick-action-card">
              My Properties
            </Link>
            <Link to="/my-inquiries" className="quick-action-card">
              My Inquiries
            </Link>
            <Link to="/saved" className="quick-action-card">
              Saved Properties
            </Link>
            <Link to="/profile" className="quick-action-card">
              Profile
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Dashboard;
