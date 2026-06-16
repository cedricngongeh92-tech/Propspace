import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api.js';
import { isBlank, isNonNegativeNumber, isPositiveNumber } from '../utils/validation.js';

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: 'apartment',
    bedrooms: '',
    bathrooms: '',
    area: '',
    status: 'available',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get(`/properties/${id}`);
        const property = response.data.property;

        setFormData({
          title: property.title || '',
          description: property.description || '',
          price: property.price || '',
          location: property.location || '',
          propertyType: property.propertyType || 'apartment',
          bedrooms: property.bedrooms || '',
          bathrooms: property.bathrooms || '',
          area: property.area || '',
          status: property.status || 'available',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleImagesChange = (event) => {
    const selectedImages = Array.from(event.target.files);

    if (selectedImages.length > 5) {
      setError('You can upload a maximum of 5 images');
      setImages(selectedImages.slice(0, 5));
      return;
    }

    setError('');
    setImages(selectedImages);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (
      isBlank(formData.title) ||
      isBlank(formData.description) ||
      isBlank(formData.price) ||
      isBlank(formData.location)
    ) {
      setError('Title, description, price, and location are required');
      return;
    }

    if (!isPositiveNumber(formData.price)) {
      setError('Price must be a positive number');
      return;
    }

    if (!isNonNegativeNumber(formData.bedrooms) || !isNonNegativeNumber(formData.bathrooms)) {
      setError('Bedrooms and bathrooms cannot be negative');
      return;
    }

    if (images.length > 5) {
      setError('You can upload a maximum of 5 images');
      return;
    }

    setSubmitting(true);

    try {
      const propertyData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        propertyData.append(key, value);
      });

      images.forEach((image) => {
        propertyData.append('images', image);
      });

      await api.put(`/properties/${id}`, propertyData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Property updated successfully');
      navigate('/my-properties');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update property');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="page">
        <p>Loading property...</p>
      </section>
    );
  }

  return (
    <section className="page form-page wide-form">
      <h1>Edit Property</h1>
      <p>Update property details and add new images.</p>

      <form className="form-card property-form" onSubmit={handleSubmit}>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <label>
          Title
          <input name="title" value={formData.title} onChange={handleChange} required />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        <div className="form-grid">
          <label>
            Price
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="1"
              required
            />
          </label>
          <label>
            Location
            <input name="location" value={formData.location} onChange={handleChange} required />
          </label>
          <label>
            Property Type
            <select name="propertyType" value={formData.propertyType} onChange={handleChange}>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </label>
          <label>
            Status
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </label>
          <label>
            Bedrooms
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              min="0"
            />
          </label>
          <label>
            Bathrooms
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              min="0"
            />
          </label>
          <label>
            Area
            <input type="number" name="area" value={formData.area} onChange={handleChange} min="0" />
          </label>
          <label>
            Add New Images
            <input type="file" accept="image/*" multiple onChange={handleImagesChange} />
          </label>
        </div>

        <button type="submit" className="button primary" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Property'}
        </button>
      </form>
    </section>
  );
}

export default EditProperty;
