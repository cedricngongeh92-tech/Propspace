import React, { useEffect, useState } from 'react';
import api from '../api/api.js';
import { useAuth } from '../context/useAuth.js';

function Profile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    profileImage: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [error, setError] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/users/profile');
      const user = response.data.user;
      setProfile(user);
      setProfileForm({
        fullName: user.fullName || '',
        phone: user.phone || '',
        profileImage: user.profileImage || '',
      });
      updateUser(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileChange = (event) => {
    setProfileForm({
      ...profileForm,
      [event.target.name]: event.target.value,
    });
  };

  const handlePasswordChange = (event) => {
    setPasswordForm({
      ...passwordForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileMessage('');
    setError('');
    setUpdatingProfile(true);

    try {
      const response = await api.put('/users/profile', profileForm);
      setProfile(response.data.user);
      updateUser(response.data.user);
      setProfileMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordMessage('');
    setError('');

    if (!passwordForm.newPassword) {
      setError('New password is required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    setChangingPassword(true);

    try {
      const response = await api.put('/users/change-password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage(response.data.message || 'Password changed successfully');
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <section className="page">
        <p>Loading profile...</p>
      </section>
    );
  }

  return (
    <section className="page">
      <h1>Profile</h1>
      <p>View and update your account information.</p>

      {error && <p className="error-message">{error}</p>}

      {profile && (
        <div className="profile-layout">
          <article className="profile-card">
            {profile.profileImage ? (
              <img className="profile-image" src={profile.profileImage} alt={profile.fullName} />
            ) : (
              <div className="profile-image-placeholder">
                {profile.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}

            <div className="profile-info">
              <h2>{profile.fullName}</h2>
              <p>{profile.email}</p>
              <p>Phone: {profile.phone || 'Not provided'}</p>
              <p>Role: {profile.role}</p>
              <p>
                Joined:{' '}
                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Not available'}
              </p>
            </div>
          </article>

          <form className="form-card profile-form" onSubmit={handleProfileSubmit}>
            <h2>Update Profile</h2>
            {profileMessage && <p className="success-message">{profileMessage}</p>}
            <label>
              Full Name
              <input
                name="fullName"
                value={profileForm.fullName}
                onChange={handleProfileChange}
                required
              />
            </label>
            <label>
              Email
              <input value={profile.email} disabled />
            </label>
            <label>
              Role
              <input value={profile.role} disabled />
            </label>
            <label>
              Phone
              <input name="phone" value={profileForm.phone} onChange={handleProfileChange} />
            </label>
            <label>
              Profile Image URL
              <input
                name="profileImage"
                value={profileForm.profileImage}
                onChange={handleProfileChange}
                placeholder="https://example.com/image.jpg"
              />
            </label>
            <button type="submit" className="button primary" disabled={updatingProfile}>
              {updatingProfile ? 'Updating...' : 'Update Profile'}
            </button>
          </form>

          <form className="form-card profile-form" onSubmit={handlePasswordSubmit}>
            <h2>Change Password</h2>
            {passwordMessage && <p className="success-message">{passwordMessage}</p>}
            <label>
              Old Password
              <input
                type="password"
                name="oldPassword"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                required
              />
            </label>
            <label>
              New Password
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </label>
            <label>
              Confirm New Password
              <input
                type="password"
                name="confirmNewPassword"
                value={passwordForm.confirmNewPassword}
                onChange={handlePasswordChange}
                required
              />
            </label>
            <button type="submit" className="button primary" disabled={changingPassword}>
              {changingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}

export default Profile;
