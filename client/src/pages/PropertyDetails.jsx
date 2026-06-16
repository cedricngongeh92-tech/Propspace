import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/useAuth.js';
import { isBlank, isValidEmail } from '../utils/validation.js';

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
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryError, setInquiryError] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

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

  const handleInquiryChange = (event) => {
    setInquiryForm({
      ...inquiryForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleInquirySubmit = async (event) => {
    event.preventDefault();
    setInquiryMessage('');
    setInquiryError('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (isBlank(inquiryForm.name) || isBlank(inquiryForm.email) || isBlank(inquiryForm.message)) {
      setInquiryError('Name, email, and message are required');
      return;
    }

    if (!isValidEmail(inquiryForm.email)) {
      setInquiryError('Please enter a valid email address');
      return;
    }

    setSubmittingInquiry(true);

    try {
      const response = await api.post(`/inquiries/property/${id}`, inquiryForm);
      setInquiryMessage(response.data.message || 'Inquiry sent successfully');
      setInquiryForm({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (err) {
      setInquiryError(err.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const ownsProperty = user && property?.owner?._id === user.id;

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

          <div className="inquiry-panel">
            <h2>Contact Owner</h2>
            {ownsProperty ? (
              <p>You own this property.</p>
            ) : (
              <form className="inquiry-form" onSubmit={handleInquirySubmit}>
                {inquiryMessage && <p className="success-message">{inquiryMessage}</p>}
                {inquiryError && <p className="error-message">{inquiryError}</p>}
                <label>
                  Name
                  <input
                    name="name"
                    value={inquiryForm.name}
                    onChange={handleInquiryChange}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={inquiryForm.email}
                    onChange={handleInquiryChange}
                    required
                  />
                </label>
                <label>
                  Phone
                  <input
                    type="tel"
                    name="phone"
                    value={inquiryForm.phone}
                    onChange={handleInquiryChange}
                  />
                </label>
                <label>
                  Message
                  <textarea
                    name="message"
                    value={inquiryForm.message}
                    onChange={handleInquiryChange}
                    required
                  />
                </label>
                <button type="submit" className="button primary" disabled={submittingInquiry}>
                  {submittingInquiry ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PropertyDetails;
