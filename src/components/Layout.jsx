import React from 'react';
import { Layers, ClipboardList, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Layout({ children, currentPageName }) {
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
