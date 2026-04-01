// Main App component - Entry point of React application
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import MyCourses from './pages/MyCourses';
import AdminPanel from './pages/AdminPanel';

function App() {
  // Check if user is logged in
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Check if user is admin
  const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
  };

  // Student-only route (redirects admin to admin panel)
  const StudentRoute = ({ children }) => {
    if (!isAuthenticated()) return <Navigate to="/login" />;
    if (isAdmin()) return <Navigate to="/admin" />;
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    );
  };

  // Admin-only route (redirects students to dashboard)
  const AdminRoute = ({ children }) => {
    if (!isAuthenticated()) return <Navigate to="/login" />;
    if (!isAdmin()) return <Navigate to="/dashboard" />;
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (with sidebar) */}
        <Route path="/dashboard" element={
          <StudentRoute><Dashboard /></StudentRoute>
        } />
        <Route path="/courses" element={
          <StudentRoute><Courses /></StudentRoute>
        } />
        <Route path="/courses/:id" element={
          <StudentRoute><CourseDetail /></StudentRoute>
        } />
        <Route path="/my-courses" element={
          <StudentRoute><MyCourses /></StudentRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute><AdminPanel /></AdminRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
