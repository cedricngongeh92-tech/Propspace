import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/api.js';

function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/inquiries');
        setInquiries(response.data.inquiries || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch inquiries');
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const filteredInquiries = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return inquiries.filter((inquiry) => {
      const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;

      const searchableText = [
        inquiry.property?.title,
        inquiry.sender?.email,
        inquiry.owner?.email,
        inquiry.name,
        inquiry.email,
        inquiry.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !searchText || searchableText.includes(searchText);

      return matchesStatus && matchesSearch;
    });
  }, [inquiries, search, statusFilter]);

  const handleStatusChange = async (inquiryId, newStatus) => {
    const selectedInquiry = inquiries.find((inquiry) => inquiry._id === inquiryId);

    if (!selectedInquiry || selectedInquiry.status === newStatus) {
      return;
    }

    const confirmed = window.confirm(`Change inquiry status to ${newStatus}?`);

    if (!confirmed) {
      return;
    }

    setMessage('');
    setError('');

    try {
      const response = await api.put(`/inquiries/${inquiryId}/status`, { status: newStatus });
      setInquiries((currentInquiries) =>
        currentInquiries.map((inquiry) =>
          inquiry._id === inquiryId ? { ...inquiry, status: response.data.inquiry.status } : inquiry,
        ),
      );
      setMessage('Inquiry status updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update inquiry status');
    }
  };

  const handleDeleteInquiry = async (inquiryId) => {
    const confirmed = window.confirm('Are you sure you want to delete this inquiry?');

    if (!confirmed) {
      return;
    }

    setMessage('');
    setError('');

    try {
      await api.delete(`/inquiries/${inquiryId}`);
      setInquiries((currentInquiries) => currentInquiries.filter((inquiry) => inquiry._id !== inquiryId));
      setMessage('Inquiry deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete inquiry');
    }
  };

  return (
    <section className="page">
      <div className="admin-inquiries-container">
        <div className="page-heading-row">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Inquiry Management</h1>
            <p>Review property inquiries, update statuses, and remove outdated messages.</p>
          </div>
        </div>

        <div className="admin-filter-row">
          <input
            className="admin-search-input"
            type="search"
            placeholder="Search by property, email, name, or status"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            className="status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        {loading && <p>Loading inquiries...</p>}

        {!loading && !error && filteredInquiries.length === 0 && (
          <div className="empty-state">
            <h2>No inquiries found</h2>
            <p>Try changing your search or status filter.</p>
          </div>
        )}

        {!loading && filteredInquiries.length > 0 && (
          <div className="admin-inquiry-list">
            {filteredInquiries.map((inquiry) => (
              <article className="inquiry-card admin-inquiry-card" key={inquiry._id}>
                <div className="inquiry-card-header">
                  <div>
                    <h2>{inquiry.property?.title || 'Property unavailable'}</h2>
                    <p>
                      {inquiry.property?.location || 'No location'} · FCFA{' '}
                      {Number(inquiry.property?.price || 0).toLocaleString()}
                    </p>
                  </div>
                  <span className={`inquiry-status ${inquiry.status}`}>{inquiry.status}</span>
                </div>

                <div className="admin-inquiry-details">
                  <p>
                    <strong>Sender:</strong> {inquiry.sender?.fullName || 'Not available'}
                  </p>
                  <p>
                    <strong>Sender Email:</strong> {inquiry.sender?.email || 'Not available'}
                  </p>
                  <p>
                    <strong>Owner:</strong> {inquiry.owner?.fullName || 'Not available'}
                  </p>
                  <p>
                    <strong>Owner Email:</strong> {inquiry.owner?.email || 'Not available'}
                  </p>
                  <p>
                    <strong>Inquiry Name:</strong> {inquiry.name}
                  </p>
                  <p>
                    <strong>Inquiry Email:</strong> {inquiry.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {inquiry.phone || 'Not provided'}
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : 'Not available'}
                  </p>
                </div>

                <p className="inquiry-message">{inquiry.message}</p>

                <div className="inquiry-actions">
                  <label>
                    Status
                    <select
                      className="status-select"
                      value={inquiry.status}
                      onChange={(event) => handleStatusChange(inquiry._id, event.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    className="button danger-button"
                    onClick={() => handleDeleteInquiry(inquiry._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminInquiries;
