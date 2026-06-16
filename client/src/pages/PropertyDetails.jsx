import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/useAuth.js';

const getImageUrl = (imagePath) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace('/api', '');
  return `${baseUrl}${imagePath}`;
};

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data.property);
      } catch (err) {
        setError(err.response?.data?.message || 'Property not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    const checkSavedProperty = async () => {
      if (!user) {
        setSaved(false);
        return;
      }

      try {
        const response = await api.get(`/favorites/${id}/check`);
        setSaved(response.data.saved);
      } catch (err) {
        setSaved(false);
      }
    };

    checkSavedProperty();
  }, [id, user]);

  const handleToggleSaved = async () => {
    setMessage('');
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    setSaving(true);

    try {
      if (saved) {
        await api.delete(`/favorites/${id}`);
        setSaved(false);
        setMessage('Property removed from saved properties');
      } else {
        await api.post(`/favorites/${id}`);
        setSaved(true);
        setMessage('Property saved successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update saved property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="page">
        <p>Loading property details...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <p className="error-message">{error}</p>
        <Link to="/properties" className="button primary">
          Back to Properties
        </Link>
      </section>
    );
  }

  return (
    <section className="page">
      <Link to="/properties" className="back-link">
        Back to Properties
      </Link>

      <div className="details-layout">
        <div className="details-gallery">
          {property.images?.length > 0 ? (
            property.images.map((image) => (
              <img key={image} src={getImageUrl(image)} alt={property.title} />
            ))
          ) : (
            <div className="details-placeholder">No Image Available</div>
          )}
        </div>

        <div className="details-content">
          <span className="status-pill">{property.status}</span>
          <h1>{property.title}</h1>
          <p className="price">FCFA {Number(property.price).toLocaleString()}</p>
          <p>{property.description}</p>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <button
            type="button"
            className={saved ? 'button secondary' : 'button save-button'}
            onClick={handleToggleSaved}
            disabled={saving}
          >
            {saving ? 'Please wait...' : saved ? 'Remove from Saved' : 'Save Property'}
          </button>

          <div className="details-grid">
            <div>
              <strong>Location</strong>
              <span>{property.location}</span>
            </div>
            <div>
              <strong>Type</strong>
              <span>{property.propertyType}</span>
            </div>
            <div>
              <strong>Bedrooms</strong>
              <span>{property.bedrooms || 0}</span>
            </div>
            <div>
              <strong>Bathrooms</strong>
              <span>{property.bathrooms || 0}</span>
            </div>
            <div>
              <strong>Area</strong>
              <span>{property.area ? `${property.area} sqm` : 'Not specified'}</span>
            </div>
          </div>

          <div className="owner-card">
            <h2>Owner</h2>
            <p>{property.owner?.fullName || 'Not available'}</p>
            <p>{property.owner?.email || 'Not available'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PropertyDetails;
