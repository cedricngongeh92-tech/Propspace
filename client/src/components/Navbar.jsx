import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        PropSpace
      </NavLink>

      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/properties">Properties</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
