import React from 'react';
import { Layers, ClipboardList, Inbox, LogOut, LogIn, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children, currentPageName }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-vh-100 bg-light">
      <header className="bg-white border-bottom sticky-top z-index-20">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between py-2" style={{ height: '64px' }}>
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-4">
                <div className="bg-primary p-2 rounded me-2">
                  <Layers className="text-white" style={{ width: '24px', height: '24px' }} />
                </div>
                <h1 className="h4 mb-0 fw-semibold text-dark">TaskFlow</h1>
              </div>
              
              {isAuthenticated && (
                <nav className="nav nav-pills">
                  <Link 
                    to={createPageUrl('ManagerZadan')}
                    className={`nav-link d-flex align-items-center gap-2 px-3 py-2 transition-colors ${
                      currentPageName === 'ManagerZadan' 
                        ? 'active bg-primary bg-opacity-10 text-primary fw-medium' 
                        : 'text-secondary hover-bg-light'
                    }`}
                  >
                    <ClipboardList size={18} />
                    <span>Zadania</span>
                  </Link>
                  <Link 
                    to={createPageUrl('ZadaniaApi')}
                    className={`nav-link d-flex align-items-center gap-2 px-3 py-2 transition-colors ${
                      currentPageName === 'ZadaniaApi' 
                        ? 'active bg-primary bg-opacity-10 text-primary fw-medium' 
                        : 'text-secondary hover-bg-light'
                    }`}
                  >
                    <Inbox size={18} />
                    <span>Zadania API</span>
                  </Link>
                </nav>
              )}
            </div>

            <div className="d-flex align-items-center gap-3">
              {isAuthenticated ? (
                <>
                  <div className="d-flex align-items-center gap-2 text-secondary">
                    <User size={18} />
                    <span className="small">{user?.name || user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                    title="Wyloguj"
                  >
                    <LogOut size={16} />
                    <span className="d-none d-md-inline">Wyloguj</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                  title="Zaloguj się"
                >
                  <LogIn size={16} />
                  <span>Zaloguj się</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="container py-4">
        {children}
      </main>
    </div>
  );
}
