import React from 'react';
import SnippetCard from './SnippetCard';
import EmptyState from './EmptyState';

export default function SnippetGrid({
  snippets,
  loading,
  error,
  filters,
  totalLibrarySnippets,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToast,
  onTagClick,
  onAddSnippet,
  onResetFilters,
  onRetry,
}) {
  // If API error
  if (error) {
    return (
      <EmptyState
        type="error"
        errorMessage={error}
        onRetry={onRetry}
      />
    );
  }

  // Loading skeleton state
  if (loading) {
    return (
      <div className="snippets-grid" aria-busy="true" aria-label="Loading snippets">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="skeleton-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="skeleton-line" style={{ width: '80px', height: '22px' }}></div>
              <div className="skeleton-line" style={{ width: '24px', height: '24px', borderRadius: '50%' }}></div>
            </div>
            <div className="skeleton-line" style={{ width: '70%', height: '20px' }}></div>
            <div className="skeleton-line" style={{ width: '90%', height: '14px' }}></div>
            <div className="skeleton-line" style={{ width: '100%', height: '110px' }}></div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
              <div className="skeleton-line" style={{ width: '50px', height: '16px' }}></div>
              <div className="skeleton-line" style={{ width: '60px', height: '16px' }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state handling
  if (!snippets || snippets.length === 0) {
    // If the whole library in DB is empty
    if (totalLibrarySnippets === 0) {
      return (
        <EmptyState
          type="empty"
          onAddSnippet={onAddSnippet}
        />
      );
    }

    // If filtered by favorites only
    if (filters.favorite) {
      return (
        <EmptyState
          type="no-favorites"
          onResetFilters={onResetFilters}
        />
      );
    }

    // Otherwise it was filtered out by search/category/language
    return (
      <EmptyState
        type="no-search"
        onResetFilters={onResetFilters}
      />
    );
  }

  // Render Snippets Grid
  return (
    <div className="snippets-grid" id="snippets-library-grid">
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet._id}
          snippet={snippet}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
          onToast={onToast}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
}
