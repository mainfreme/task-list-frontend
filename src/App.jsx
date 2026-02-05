import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import ManagerZadan from './pages/ManagerZadan';
import ZadaniaApi from './pages/ZadaniaApi';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css'

function App() {
  const location = useLocation();
  
  // Determine current page name based on path
  const getCurrentPageName = () => {
    if (location.pathname === '/tasks' || location.pathname === '/') return 'ManagerZadan';
    if (location.pathname === '/api-tasks') return 'ZadaniaApi';
    if (location.pathname === '/login') return 'Login';
    if (location.pathname === '/register') return 'Register';
    return 'ManagerZadan'; // Default
  };

  // Public routes (login, register) don't need layout
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <Layout currentPageName={getCurrentPageName()}>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route 
          path="/tasks" 
          element={
            <PrivateRoute>
              <ManagerZadan />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/api-tasks" 
          element={
            <PrivateRoute>
              <ZadaniaApi />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Layout>
  );
}

export default App;
