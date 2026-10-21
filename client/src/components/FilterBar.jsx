import React from 'react';
import { Search, X, Star, Filter, ArrowUpDown } from 'lucide-react';
import {
  CONTENT_TYPES,
  PROGRAMMING_LANGUAGES,
  CATEGORIES,
  SORT_OPTIONS,
} from '../utils/constants';

export default function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
  totalLibrarySnippets,
}) {
  const isFiltered =
    Boolean(filters.search) ||
    filters.category !== 'All' ||
    filters.language !== 'All' ||
    filters.contentType !== 'all' ||
    filters.favorite ||
    filters.sortBy !== 'newest';

  return (
    <div className="filter-toolbar" id="library-toolbar">
      {/* Top Row: Search, Category, Language, Favorites Toggle, Sort */}
      <div className="toolbar-top-row">
        {/* Main Search Input */}
        <div className="search-input-box">
          <Search size={16} className="search-icon-svg" />
          <input
            type="text"
            className="search-input"
            placeholder="Search snippets, tags, languages..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            id="main-search-input"
          />
          {filters.search && (
            <button
              className="clear-search-btn"
              onClick={() => onFilterChange('search', '')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Select */}
        <div className="toolbar-select-group">
          <select
            className="custom-select"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            aria-label="Filter by category"
            id="category-filter-select"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Language Select */}
          <select
            className="custom-select"
            value={filters.language}
            onChange={(e) => onFilterChange('language', e.target.value)}
            aria-label="Filter by programming language"
            id="language-filter-select"
          >
            <option value="All">All Languages</option>
            {PROGRAMMING_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            className="custom-select"
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            aria-label="Sort snippets"
            id="sort-select"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Favorites Only Toggle */}
          <button
            className={`favorite-toggle-btn ${filters.favorite ? 'active' : ''}`}
            onClick={() => onFilterChange('favorite', !filters.favorite)}
            id="favorite-filter-btn"
            aria-pressed={filters.favorite}
          >
            <Star
              size={15}
              fill={filters.favorite ? 'currentColor' : 'none'}
            />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Content Type Pills & Result Count */}
      <div className="toolbar-bottom-row">
        {/* Type Filter Pills */}
        <div className="type-pills" role="radiogroup" aria-label="Filter by Content Type">
          {CONTENT_TYPES.map((type) => (
            <button
              key={type.id}
              className={`type-pill ${filters.contentType === type.id ? 'active' : ''}`}
              onClick={() => onFilterChange('contentType', type.id)}
              role="radio"
              aria-checked={filters.contentType === type.id}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Results Count & Clear Filters */}
        <div className="toolbar-status-summary">
          <span>
            Showing <strong>{totalResults}</strong> of {totalLibrarySnippets} snippets
          </span>

          {isFiltered && (
            <button
              className="clear-all-link"
              onClick={onResetFilters}
              id="clear-filters-btn"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
