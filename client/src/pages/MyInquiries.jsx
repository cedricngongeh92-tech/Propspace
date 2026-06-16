import React, { useEffect, useState } from 'react';
import api from '../api/api.js';

function MyInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/inquiries/my-properties');
      setInquiries(response.data.inquiries || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateInquiryStatus = async (inquiryId, status) => {
    setMessage('');
    setError('');

    try {
      const response = await api.put(`/inquiries/${inquiryId}/status`, { status });
      setInquiries(
        inquiries.map((inquiry) =>
          inquiry._id === inquiryId ? { ...inquiry, status: response.data.inquiry.status } : inquiry
        )
      );
      setMessage('Inquiry status updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update inquiry status');
    }
  };

  const deleteInquiry = async (inquiryId) => {
    const confirmed = window.confirm('Are you sure you want to delete this inquiry?');

    if (!confirmed) {
      return;
    }

    setMessage('');
    setError('');

    try {
      await api.delete(`/inquiries/${inquiryId}`);
      setInquiries(inquiries.filter((inquiry) => inquiry._id !== inquiryId));
      setMessage('Inquiry deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete inquiry');
    }
  };

  return (
    <section className="page">
      <h1>My Inquiries</h1>
      <p>View and manage inquiries received for your property listings.</p>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading inquiries...</p>}
      {!loading && inquiries.length === 0 && (
        <div className="empty-state">
          <h2>No inquiries yet</h2>
          <p>Messages from interested users will appear here.</p>
        </div>
      )}

      {!loading && inquiries.length > 0 && (
        <div className="inquiry-list">
          {inquiries.map((inquiry) => (
            <article className="inquiry-card" key={inquiry._id}>
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

              <div className="inquiry-details">
                <p>
                  <strong>Sender:</strong> {inquiry.name}
                </p>
                <p>
                  <strong>Email:</strong> {inquiry.email}
                </p>
                <p>
                  <strong>Phone:</strong> {inquiry.phone || 'Not provided'}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(inquiry.createdAt).toLocaleDateString()}
                </p>
              </div>

              <p className="inquiry-message">{inquiry.message}</p>

              <div className="inquiry-actions">
                <label>
                  Status
                  <select
                    className="status-select"
                    value={inquiry.status}
                    onChange={(event) => updateInquiryStatus(inquiry._id, event.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>
                <button
                  type="button"
                  className="button danger"
                  onClick={() => deleteInquiry(inquiry._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyInquiries;
