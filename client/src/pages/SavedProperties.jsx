import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api.js';
import { getImageUrl } from '../utils/imageUrl.js';

function SavedProperties() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchSavedProperties = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/favorites');
      setFavorites(response.data.favorites || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch saved properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  const removeSavedProperty = async (propertyId) => {
    const confirmed = window.confirm('Remove this property from your saved list?');

    if (!confirmed) {
      return;
    }

    setMessage('');
    setError('');

    try {
      await api.delete(`/favorites/${propertyId}`);
      setFavorites(favorites.filter((favorite) => favorite.property?._id !== propertyId));
      setMessage('Property removed from saved properties');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove saved property');
    }
  };

  return (
    <section className="page">
      <h1>Saved Properties</h1>
      <p>View and manage properties you have saved.</p>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading saved properties...</p>}
      {!loading && favorites.length === 0 && (
        <div className="empty-state">
          <h2>No saved properties yet</h2>
          <p>Browse properties and save the ones you like.</p>
          <Link to="/properties" className="button primary">
            Browse Properties
          </Link>
        </div>
      )}

      {!loading && favorites.length > 0 && (
        <div className="property-grid">
          {favorites.map((favorite) => {
            const property = favorite.property;

            if (!property) {
              return null;
            }

            return (
              <article className="property-card saved-card" key={favorite._id}>
                {property.images?.length > 0 ? (
                  <img
                    className="property-card-image"
                    src={getImageUrl(property.images[0])}
                    alt={property.title}
                  />
                ) : (
                  <div className="image-placeholder">No Image Available</div>
                )}
                <div className="property-card-body">
                  <div className="property-card-top">
                    <h2>{property.title}</h2>
                    <span className="status-pill">{property.status}</span>
                  </div>
                  <p>{property.location}</p>
                  <p className="price">FCFA {Number(property.price).toLocaleString()}</p>
                  <div className="property-meta">
                    <span>{property.propertyType}</span>
                    <span>{property.bedrooms || 0} beds</span>
                    <span>{property.bathrooms || 0} baths</span>
                  </div>
                  <div className="property-actions">
                    <Link to={`/properties/${property._id}`} className="button primary">
                      View Details
                    </Link>
                    <button
                      type="button"
                      className="button danger"
                      onClick={() => removeSavedProperty(property._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default SavedProperties;
