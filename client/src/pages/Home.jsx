import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <section className="page hero">
      <div>
        <p className="eyebrow">Property listing made simple</p>
        <h1>Welcome to PropSpace</h1>
        <p>Find, list, and manage properties easily.</p>
        <div className="actions">
          <Link to="/properties" className="button primary">
            Browse Properties
          </Link>
          <Link to="/register" className="button secondary">
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;
