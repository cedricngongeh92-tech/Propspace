import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api.js';
import { useAuth } from '../context/useAuth.js';

const initialFilters = {
  search: '',
  location: '',
  propertyType: '',
  minPrice: '',
  maxPrice: '',
  bedrooms: '',
  status: '',
};

const getImageUrl = (imagePath) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace('/api', '');
  return `${baseUrl}${imagePath}`;
};

function Properties() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchProperties = async (pageNumber = 1, activeFilters = filters) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const params = {
        page: pageNumber,
        limit: 6,
      };

      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value) {
          params[key] = value;
        }
      });

      const response = await api.get('/properties', { params });
      setProperties(response.data.properties || []);
      setPage(response.data.page || 1);
      setPages(response.data.pages || 1);
      setTotal(response.data.total || 0);
      setCount(response.data.count || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(1, initialFilters);
  }, []);

  const handleChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchProperties(1, filters);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    fetchProperties(1, initialFilters);
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      fetchProperties(page - 1, filters);
    }
  };

  const goToNextPage = () => {
    if (page < pages) {
      fetchProperties(page + 1, filters);
    }
  };

  const handleSaveProperty = async (propertyId) => {
    setMessage('');
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(`/favorites/${propertyId}`);
      setMessage(response.data.message || 'Property saved successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save property');
    }
  };

  return (
    <section className="page">
      <h1>Properties</h1>
      <p>Browse available listings and filter by location, type, price, bedrooms, and status.</p>

      <form className="filter-form" onSubmit={handleSearch}>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search title, description, or location"
        />
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Location"
        />
        <select name="propertyType" value={filters.propertyType} onChange={handleChange}>
          <option value="">Property Type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="land">Land</option>
          <option value="commercial">Commercial</option>
        </select>
        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="Min price"
        />
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="Max price"
        />
        <input
          type="number"
          name="bedrooms"
          value={filters.bedrooms}
          onChange={handleChange}
          placeholder="Bedrooms"
        />
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">Status</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="rented">Rented</option>
        </select>
        <div className="filter-actions">
          <button type="submit" className="button primary">
            Search
          </button>
          <button type="button" className="button secondary" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </form>

      {loading && <p>Loading properties...</p>}
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && properties.length === 0 && <p>No properties found.</p>}

      {!loading && !error && properties.length > 0 && (
        <>
          <div className="results-summary">
            Showing {count} of {total} properties
          </div>
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
                      className="button save-button"
                      onClick={() => handleSaveProperty(property._id)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="pagination">
            <button
              type="button"
              className="button secondary"
              onClick={goToPreviousPage}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button
              type="button"
              className="button secondary"
              onClick={goToNextPage}
              disabled={page >= pages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Properties;
