import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const features = [
    {
      title: 'Search Properties',
      description: 'Browse listings by location, type, price, bedrooms, and status.',
    },
    {
      title: 'Save Favorites',
      description: 'Keep track of the homes and spaces you want to revisit.',
    },
    {
      title: 'Contact Owners',
      description: 'Send property inquiries directly from the property details page.',
    },
    {
      title: 'Manage Listings',
      description: 'Create, update, and organize your own property listings.',
    },
  ];

  return (
    <section className="page home-page">
      <div className="hero">
        <div className="hero-content">
          <p className="eyebrow">Property listing made simple</p>
          <h1>Welcome to PropSpace</h1>
          <p>
            Find, list, save, and manage properties from one clean workspace built for buyers,
            owners, agents, and admins.
          </p>
          <div className="actions">
            <Link to="/properties" className="button primary">
              Browse Properties
            </Link>
            <Link to="/properties/create" className="button secondary">
              Add Property
            </Link>
          </div>
        </div>
      </div>

      <div className="feature-grid">
        {features.map((feature) => (
          <article className="feature-card" key={feature.title}>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Home;
