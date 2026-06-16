import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="page not-found-page">
      <div className="not-found-card">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist or may have been moved.</p>
        <Link to="/" className="button primary">
          Back to Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
