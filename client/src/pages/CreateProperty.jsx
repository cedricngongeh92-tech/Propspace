import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import { isBlank, isNonNegativeNumber, isPositiveNumber } from '../utils/validation.js';

const initialFormData = {
  title: '',
  description: '',
  price: '',
  location: '',
  propertyType: 'apartment',
  bedrooms: '',
  bathrooms: '',
  area: '',
  status: 'available',
};

function CreateProperty() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

      await api.post('/properties', propertyData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Property created successfully');
      navigate('/my-properties');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create property');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page form-page wide-form">
      <h1>Add Property</h1>
      <p>Create a new property listing with up to 5 images.</p>

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
            Images
            <input type="file" accept="image/*" multiple onChange={handleImagesChange} />
          </label>
        </div>

        <button type="submit" className="button primary" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Property'}
        </button>
      </form>
    </section>
  );
}

export default CreateProperty;
