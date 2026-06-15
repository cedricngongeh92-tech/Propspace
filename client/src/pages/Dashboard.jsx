import React from 'react';
import { useAuth } from '../context/useAuth.js';

function Dashboard() {
  const { user } = useAuth();

  return (
    <section className="page">
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.fullName}.</p>
      <div className="card-grid">
        <article className="card">
          <h2>Account</h2>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
        </article>
      </div>
    </section>
  );
}

export default Dashboard;
