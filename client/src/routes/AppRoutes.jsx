import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import CreateProperty from '../pages/CreateProperty.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import EditProperty from '../pages/EditProperty.jsx';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import MyInquiries from '../pages/MyInquiries.jsx';
import MyProperties from '../pages/MyProperties.jsx';
import NotFound from '../pages/NotFound.jsx';
import Profile from '../pages/Profile.jsx';
import Properties from '../pages/Properties.jsx';
import PropertyDetails from '../pages/PropertyDetails.jsx';
import Register from '../pages/Register.jsx';
import SavedProperties from '../pages/SavedProperties.jsx';
import AdminRoute from './AdminRoute.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved" element={<SavedProperties />} />
            <Route path="/properties/create" element={<CreateProperty />} />
            <Route path="/my-properties" element={<MyProperties />} />
            <Route path="/my-inquiries" element={<MyInquiries />} />
            <Route path="/properties/:id/edit" element={<EditProperty />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
