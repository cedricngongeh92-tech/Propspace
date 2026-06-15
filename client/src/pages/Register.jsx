import React from 'react';

function Register() {
  return (
    <section className="page form-page">
      <h1>Register</h1>
      <form className="form-card">
        <label>
          Full Name
          <input type="text" placeholder="Your full name" />
        </label>
        <label>
          Email
          <input type="email" placeholder="you@example.com" />
        </label>
        <label>
          Password
          <input type="password" placeholder="Create a password" />
        </label>
        <button type="button" className="button primary">
          Register
        </button>
      </form>
    </section>
  );
}

export default Register;
