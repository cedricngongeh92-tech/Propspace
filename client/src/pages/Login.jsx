import React from 'react';

function Login() {
  return (
    <section className="page form-page">
      <h1>Login</h1>
      <form className="form-card">
        <label>
          Email
          <input type="email" placeholder="you@example.com" />
        </label>
        <label>
          Password
          <input type="password" placeholder="Your password" />
        </label>
        <button type="button" className="button primary">
          Login
        </button>
      </form>
    </section>
  );
}

export default Login;
