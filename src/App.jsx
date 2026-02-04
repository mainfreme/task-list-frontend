import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ManagerZadan from './pages/ManagerZadan';
import ZadaniaApi from './pages/ZadaniaApi';
import './App.css'

function App() {
  const location = useLocation();
  
  // Determine current page name based on path
  const getCurrentPageName = () => {
    if (location.pathname === '/tasks' || location.pathname === '/') return 'ManagerZadan';
    if (location.pathname === '/api-tasks') return 'ZadaniaApi';
    return 'ManagerZadan'; // Default
  };

  return (
    <Layout currentPageName={getCurrentPageName()}>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<ManagerZadan />} />
        <Route path="/api-tasks" element={<ZadaniaApi />} />
      </Routes>
    </Layout>
  );
}

export default App;
