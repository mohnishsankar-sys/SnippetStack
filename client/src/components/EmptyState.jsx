import React from 'react';
import { Plus, Search, Star, AlertCircle, RefreshCw, FolderPlus } from 'lucide-react';

export default function EmptyState({
  type = 'empty', // 'empty' | 'no-search' | 'no-favorites' | 'error'
  onAddSnippet,
  onResetFilters,
  onRetry,
  errorMessage,
}) {
  if (type === 'error') {
    return (
      <div className="empty-state-card" role="alert">
        <div className="empty-state-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger-color)' }}>
          <AlertCircle size={32} />
        </div>
        <h3 className="empty-state-title">Connection Error</h3>
        <p className="empty-state-desc">
          {errorMessage || 'Unable to connect to the SnippetStack API server. Please make sure the backend server and MongoDB Community Server are running.'}
        </p>
        {onRetry && (
          <button className="btn-secondary" onClick={onRetry} style={{ marginTop: '0.5rem' }}>
            <RefreshCw size={16} />
            <span>Retry Connection</span>
          </button>
        )}
      </div>
    );
  }

  if (type === 'no-search') {
    return (
      <div className="empty-state-card">
        <div className="empty-state-icon" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
          <Search size={32} />
        </div>
        <h3 className="empty-state-title">No matching snippets found</h3>
        <p className="empty-state-desc">
          We couldn't find any snippets matching your search query or active filter combination.
        </p>
        {onResetFilters && (
          <button className="btn-primary" onClick={onResetFilters} style={{ marginTop: '0.5rem' }}>
            <span>Clear All Filters</span>
          </button>
        )}
      </div>
    );
  }

  if (type === 'no-favorites') {
    return (
      <div className="empty-state-card">
        <div className="empty-state-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)' }}>
          <Star size={32} />
        </div>
        <h3 className="empty-state-title">No favorite snippets yet</h3>
        <p className="empty-state-desc">
          Click the star icon on any snippet card to bookmark your most important and frequently used snippets here.
        </p>
        {onResetFilters && (
          <button className="btn-secondary" onClick={onResetFilters} style={{ marginTop: '0.5rem' }}>
            <span>Show All Snippets</span>
          </button>
        )}
      </div>
    );
  }

  // Default: completely empty library
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon">
        <FolderPlus size={32} />
      </div>
      <h3 className="empty-state-title">Your library starts here.</h3>
      <p className="empty-state-desc">
        Save your first code snippet or AI prompt to build your personal developer toolkit.
      </p>
      {onAddSnippet && (
        <button className="btn-primary" onClick={onAddSnippet} style={{ marginTop: '0.5rem' }}>
          <Plus size={18} strokeWidth={2.5} />
          <span>Add Your First Snippet</span>
        </button>
      )}
    </div>
  );
}
