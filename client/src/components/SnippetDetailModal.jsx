import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  Tag,
  Star,
  Terminal,
} from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';

import { formatFullDate, getPrismLanguage, copyToClipboard } from '../utils/formatters';
import { LANGUAGE_STYLES } from '../utils/constants';

export default function SnippetDetailModal({
  snippet,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToast,
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [snippet]);

  if (!snippet) return null;

  const handleCopy = async () => {
    try {
      await copyToClipboard(snippet.content);
      setCopied(true);
      if (onToast) onToast('Copied full snippet to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (onToast) onToast('Failed to copy', 'error');
    }
  };

  const prismLang = getPrismLanguage(snippet.language);
  const langStyle = LANGUAGE_STYLES[snippet.language] || LANGUAGE_STYLES.Other;
  const lineCount = snippet.content.split('\n').length;
  const charCount = snippet.content.length;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card large"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
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
            <span className="category-tag">{snippet.category}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', textTransform: 'capitalize' }}>
              • {snippet.contentType}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className={`card-fav-btn ${snippet.isFavorite ? 'favorited' : ''}`}
              onClick={() => onToggleFavorite(snippet._id, !snippet.isFavorite)}
              title={snippet.isFavorite ? 'Favorited' : 'Add to favorites'}
            >
              <Star size={18} fill={snippet.isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Title & Description */}
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--main-text)', lineHeight: 1.3 }}>
              {snippet.title}
            </h2>
            {snippet.description && (
              <p style={{ marginTop: '0.5rem', color: 'var(--secondary-text)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                {snippet.description}
              </p>
            )}
          </div>

          {/* Code Viewer Container */}
          <div style={{
            background: '#090E17',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            {/* Code Box Toolbar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 1rem',
              background: 'rgba(17, 24, 39, 0.7)',
              borderBottom: '1px solid var(--border-color)',
              fontSize: '0.75rem',
              color: 'var(--secondary-text)'
            }}>
              <span>{lineCount} lines • {charCount} chars</span>
              <button
                className="btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                onClick={handleCopy}
              >
                {copied ? <Check size={14} style={{ color: 'var(--primary-accent)' }} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code / Content */}
            <div style={{ padding: '1.25rem', overflowX: 'auto', maxHeight: '420px' }}>
              {snippet.contentType === 'prompt' ? (
                <div style={{
                  fontFamily: 'var(--font-sans)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.7,
                  color: '#E2E8F0',
                  fontSize: '0.9rem'
                }}>
                  {snippet.content}
                </div>
              ) : (
                <pre style={{ margin: 0, padding: 0, background: 'transparent' }}>
                  <code className={`language-${prismLang}`}>
                    {snippet.content}
                  </code>
                </pre>
              )}
            </div>
          </div>

          {/* Metadata Footer: Tags & Timestamps */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.8125rem',
            color: 'var(--secondary-text)'
          }}>
            {/* Tags */}
            {snippet.tags && snippet.tags.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Tag size={14} style={{ color: 'var(--primary-accent)' }} />
                {snippet.tags.map((t, idx) => (
                  <span key={idx} className="tag-pill">#{t}</span>
                ))}
              </div>
            )}

            {/* Timestamps */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={13} />
                <span>Created: {formatFullDate(snippet.createdAt)}</span>
              </div>
              {snippet.updatedAt && snippet.updatedAt !== snippet.createdAt && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={13} />
                  <span>Updated: {formatFullDate(snippet.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button
            className="icon-action-btn delete"
            style={{ marginRight: 'auto', padding: '0.5rem 0.85rem', gap: '0.4rem', display: 'flex' }}
            onClick={() => {
              onClose();
              onDelete(snippet);
            }}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>

          <button
            className="btn-secondary"
            onClick={() => {
              onClose();
              onEdit(snippet);
            }}
          >
            <Edit2 size={16} />
            <span>Edit</span>
          </button>

          <button
            className="btn-primary"
            onClick={handleCopy}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy Full Content'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
