import React from 'react';
import { Code2, Plus, Search, Database } from 'lucide-react';

export default function Navbar({
  searchTerm,
  onSearchChange,
  onOpenAddModal,
  dbStatus,
}) {
  return (
    <header className="navbar" role="banner">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand-wrapper">
          <div className="brand-icon-box" aria-hidden="true">
            <Code2 size={24} strokeWidth={2.2} />
          </div>
          <div className="brand-titles">
            <span className="brand-name">SnippetStack</span>
            <span className="brand-tagline">Your Personal Code Library</span>
          </div>
        </div>

        {/* Center Quick Search (Desktop) */}
        <div className="nav-center-search">
          <div className="search-input-box">
            <Search size={16} className="search-icon-svg" />
            <input
              type="text"
              className="search-input"
              placeholder="Quick search code, prompts, tags..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              id="navbar-search-input"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* MongoDB Status Indicator */}
          <div
            className="db-status-badge"
            title={`MongoDB: ${dbStatus === 'online' ? 'Connected (localhost:27017)' : 'Disconnected'}`}
          >
            <span
              className={`status-dot ${dbStatus === 'online' ? 'online' : 'offline'}`}
            />
            <span style={{ color: 'var(--secondary-text)' }}>
              {dbStatus === 'online' ? 'MongoDB' : 'Offline'}
            </span>
          </div>

          {/* Add Snippet Button */}
          <button
            className="btn-primary"
            onClick={onOpenAddModal}
            id="nav-add-snippet-btn"
            aria-label="Add new snippet"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Snippet</span>
          </button>
        </div>
      </div>
    </header>
  );
}
