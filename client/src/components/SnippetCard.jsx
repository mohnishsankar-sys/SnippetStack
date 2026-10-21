import React, { useState } from 'react';
import {
  Star,
  Copy,
  Check,
  Eye,
  Edit2,
  Trash2,
  Terminal,
  MessageSquare,
  FileCode,
} from 'lucide-react';
import { formatDate, getPrismLanguage, copyToClipboard } from '../utils/formatters';
import { LANGUAGE_STYLES } from '../utils/constants';

export default function SnippetCard({
  snippet,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToast,
  onTagClick,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await copyToClipboard(snippet.content);
      setCopied(true);
      if (onToast) onToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (onToast) onToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(snippet._id, !snippet.isFavorite);
  };

  const handleCardClick = () => {
    onViewDetails(snippet);
  };

  const langStyle = LANGUAGE_STYLES[snippet.language] || LANGUAGE_STYLES.Other;

  // Render appropriate content preview based on contentType
  const renderPreview = () => {
    if (snippet.contentType === 'command') {
      return (
        <div className="code-preview-box">
          <pre>
            <code>
              {snippet.content.split('\n').slice(0, 5).map((line, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--primary-accent)', userSelect: 'none' }}>$</span>
                  <span>{line}</span>
                </div>
              ))}
            </code>
          </pre>
          <div className="code-preview-fade"></div>
        </div>
      );
    }

    if (snippet.contentType === 'prompt') {
      return (
        <div
          className="code-preview-box"
          style={{
            background: 'rgba(21, 31, 50, 0.7)',
            borderLeft: '3px solid var(--secondary-accent)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <pre style={{ fontFamily: 'var(--font-sans)', whiteSpace: 'pre-wrap', color: '#CBD5E1' }}>
            {snippet.content.length > 220
              ? `${snippet.content.substring(0, 220)}...`
              : snippet.content}
          </pre>
          <div className="code-preview-fade"></div>
        </div>
      );
    }

    // Default code snippet preview
    return (
      <div className="code-preview-box">
        <pre>
          <code>
            {snippet.content.split('\n').slice(0, 6).join('\n')}
          </code>
        </pre>
        <div className="code-preview-fade"></div>
      </div>
    );
  };

  return (
    <article className="snippet-card" aria-label={snippet.title}>
      {/* Top Header: Content type, Language badge, Category & Favorite Button */}
      <div className="card-top-bar">
        <div className="card-badges">
          {/* Language Pill */}
          <span
            className="badge-pill"
            style={{
              backgroundColor: langStyle.bg,
              color: langStyle.text,
              border: `1px solid ${langStyle.border}`,
            }}
          >
            {snippet.language}
          </span>

          {/* Category Tag */}
          <span className="category-tag">{snippet.category}</span>
        </div>

        {/* Favorite Star Button */}
        <button
          className={`card-fav-btn ${snippet.isFavorite ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          title={snippet.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={snippet.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star size={16} fill={snippet.isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Main Content Area: Title, Description, Preview, Tags */}
      <div className="card-content-area" onClick={handleCardClick}>
        <h3 className="card-title" title={snippet.title}>
          {snippet.title}
        </h3>

        {snippet.description && (
          <p className="card-description">{snippet.description}</p>
        )}

        {/* Code / Prompt / Command Box */}
        {renderPreview()}

        {/* Tags */}
        {snippet.tags && snippet.tags.length > 0 && (
          <div className="card-tags">
            {snippet.tags.map((tag, idx) => (
              <span
                key={idx}
                className="tag-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTagClick) onTagClick(tag);
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Date & Action Toolbar */}
      <div className="card-footer">
        <span className="card-date">{formatDate(snippet.createdAt)}</span>

        <div className="card-action-buttons">
          {/* Copy Button */}
          <button
            className={`icon-action-btn copy ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy full snippet'}
            aria-label="Copy snippet code"
          >
            {copied ? (
              <Check size={16} style={{ color: 'var(--primary-accent)' }} />
            ) : (
              <Copy size={16} />
            )}
          </button>

          {/* View Details Button */}
          <button
            className="icon-action-btn"
            onClick={() => onViewDetails(snippet)}
            title="View full details"
            aria-label="View snippet details"
          >
            <Eye size={16} />
          </button>

          {/* Edit Button */}
          <button
            className="icon-action-btn"
            onClick={() => onEdit(snippet)}
            title="Edit snippet"
            aria-label="Edit snippet"
          >
            <Edit2 size={16} />
          </button>

          {/* Delete Button */}
          <button
            className="icon-action-btn delete"
            onClick={() => onDelete(snippet)}
            title="Delete snippet"
            aria-label="Delete snippet"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
