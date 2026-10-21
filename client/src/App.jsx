import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsCards from './components/StatsCards';
import FilterBar from './components/FilterBar';
import SnippetGrid from './components/SnippetGrid';
import SnippetModal from './components/SnippetModal';
import SnippetDetailModal from './components/SnippetDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import api from './services/api';

export default function App() {
  // Main data states
  const [snippets, setSnippets] = useState([]);
  const [stats, setStats] = useState({
    totalSnippets: 0,
    languagesCount: 0,
    favoritesCount: 0,
    recentlyAddedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dbStatus, setDbStatus] = useState('offline');

  // Filter & Search states
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    language: 'All',
    contentType: 'all',
    favorite: false,
    sortBy: 'newest',
  });

  // Modal states
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'create', // 'create' | 'edit'
    snippetData: null,
  });
  const [detailSnippet, setDetailSnippet] = useState(null);
  const [snippetToDelete, setSnippetToDelete] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch snippets based on current filters
  const loadSnippets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getSnippets(filters);
      if (res.success) {
        setSnippets(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load snippets:', err);
      setError(err.message || 'Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch stats from backend
  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await api.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load statistics:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Check health and initial connection
  const checkHealth = useCallback(async () => {
    try {
      const res = await api.checkHealth();
      if (res.success && res.database?.status === 'connected') {
        setDbStatus('online');
      } else {
        setDbStatus('offline');
      }
    } catch (err) {
      setDbStatus('offline');
    }
  }, []);

  // Initial load
  useEffect(() => {
    checkHealth();
    loadStats();
  }, [checkHealth, loadStats]);

  // Trigger snippet search & filter on filter changes
  useEffect(() => {
    loadSnippets();
  }, [loadSnippets]);

  // Handlers for filters
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      language: 'All',
      contentType: 'all',
      favorite: false,
      sortBy: 'newest',
    });
  };

  const handleTagClick = (tag) => {
    setFilters((prev) => ({
      ...prev,
      search: tag,
    }));
    handleScrollToLibrary();
  };

  const handleScrollToLibrary = () => {
    const el = document.getElementById('library-toolbar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open Add Snippet Modal
  const handleOpenAddModal = () => {
    setModalState({
      isOpen: true,
      mode: 'create',
      snippetData: null,
    });
  };

  // Open Edit Snippet Modal
  const handleOpenEditModal = (snippet) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      snippetData: snippet,
    });
  };

  // Create or Update submission
  const handleSaveSnippet = async (formData) => {
    if (modalState.mode === 'create') {
      const res = await api.createSnippet(formData);
      if (res.success) {
        addToast('Snippet saved successfully!', 'success');
        loadSnippets();
        loadStats();
      }
    } else if (modalState.mode === 'edit' && modalState.snippetData) {
      const res = await api.updateSnippet(modalState.snippetData._id, formData);
      if (res.success) {
        addToast('Snippet updated successfully!', 'success');
        loadSnippets();
        loadStats();
        // If details modal is open for this item, update it
        if (detailSnippet && detailSnippet._id === modalState.snippetData._id) {
          setDetailSnippet(res.data);
        }
      }
    }
  };

  // Toggle favorite with optimistic UI update
  const handleToggleFavorite = async (id, newFavoriteStatus) => {
    // Optimistic update
    setSnippets((prev) =>
      prev.map((s) => (s._id === id ? { ...s, isFavorite: newFavoriteStatus } : s))
    );
    if (detailSnippet && detailSnippet._id === id) {
      setDetailSnippet((prev) => ({ ...prev, isFavorite: newFavoriteStatus }));
    }

    try {
      const res = await api.toggleFavorite(id, newFavoriteStatus);
      if (res.success) {
        addToast(
          newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites',
          'success'
        );
        loadStats();
      }
    } catch (err) {
      // Revert if error
      setSnippets((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isFavorite: !newFavoriteStatus } : s))
      );
      addToast('Failed to update favorite status', 'error');
    }
  };

  // Delete Snippet
  const handleConfirmDelete = async (id) => {
    try {
      const res = await api.deleteSnippet(id);
      if (res.success) {
        addToast('Snippet deleted successfully', 'success');
        setSnippets((prev) => prev.filter((s) => s._id !== id));
        if (detailSnippet && detailSnippet._id === id) {
          setDetailSnippet(null);
        }
        loadStats();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete snippet', 'error');
      throw err;
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        searchTerm={filters.search}
        onSearchChange={(val) => handleFilterChange('search', val)}
        onOpenAddModal={handleOpenAddModal}
        dbStatus={dbStatus}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Hero Section */}
        <Hero
          onOpenAddModal={handleOpenAddModal}
          onScrollToLibrary={handleScrollToLibrary}
        />

        {/* Dynamic Statistics Cards */}
        <StatsCards stats={stats} loading={statsLoading} />

        {/* Search, Filter, & Sort Toolbar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={snippets.length}
          totalLibrarySnippets={stats.totalSnippets}
        />

        {/* Snippets Responsive Grid */}
        <SnippetGrid
          snippets={snippets}
          loading={loading}
          error={error}
          filters={filters}
          totalLibrarySnippets={stats.totalSnippets}
          onViewDetails={(snippet) => setDetailSnippet(snippet)}
          onEdit={handleOpenEditModal}
          onDelete={(snippet) => setSnippetToDelete(snippet)}
          onToggleFavorite={handleToggleFavorite}
          onToast={addToast}
          onTagClick={handleTagClick}
          onAddSnippet={handleOpenAddModal}
          onResetFilters={handleResetFilters}
          onRetry={() => {
            checkHealth();
            loadStats();
            loadSnippets();
          }}
        />
      </main>

      {/* Add / Edit Snippet Modal */}
      <SnippetModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        snippetData={modalState.snippetData}
        onClose={() => setModalState({ isOpen: false, mode: 'create', snippetData: null })}
        onSubmit={handleSaveSnippet}
      />

      {/* View Full Snippet Details Modal */}
      <SnippetDetailModal
        snippet={detailSnippet}
        onClose={() => setDetailSnippet(null)}
        onEdit={handleOpenEditModal}
        onDelete={(snippet) => setSnippetToDelete(snippet)}
        onToggleFavorite={handleToggleFavorite}
        onToast={addToast}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        snippet={snippetToDelete}
        isOpen={Boolean(snippetToDelete)}
        onClose={() => setSnippetToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
