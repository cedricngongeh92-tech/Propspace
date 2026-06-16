import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/useAuth.js';

const getImageUrl = (imagePath) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace('/api', '');
  return `${baseUrl}${imagePath}`;
};

function MyProperties() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchMyProperties = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/properties', {
        params: { limit: 100 },
      });
      const myProperties = (response.data.properties || []).filter(
        (property) => property.owner?._id === user?.id
      );
      setProperties(myProperties);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, [user]);

  const handleDelete = async (propertyId) => {
    const confirmed = window.confirm('Are you sure you want to delete this property?');

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/properties/${propertyId}`);
      setProperties(properties.filter((property) => property._id !== propertyId));
      setMessage('Property deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete property');
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>My Properties</h1>
          <p>Manage the properties you have listed.</p>
        </div>
        <Link to="/properties/create" className="button primary">
          Add Property
        </Link>
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading your properties...</p>}
      {!loading && properties.length === 0 && <p>You have not created any properties yet.</p>}

      {!loading && properties.length > 0 && (
        <div className="property-grid">
          {properties.map((property) => (
            <article className="property-card" key={property._id}>
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
                <div className="management-actions">
                  <Link to={`/properties/${property._id}`} className="button secondary">
                    View Details
                  </Link>
                  <Link to={`/properties/${property._id}/edit`} className="button primary">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="button danger"
                    onClick={() => handleDelete(property._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyProperties;
