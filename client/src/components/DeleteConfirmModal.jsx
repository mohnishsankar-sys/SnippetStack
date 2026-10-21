import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  snippet,
  isOpen,
  onClose,
  onConfirm,
}) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !snippet) return null;

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onConfirm(snippet._id);
      onClose();
    } catch (err) {
      console.error('Delete error', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card"
        style={{ maxWidth: '480px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--danger-color)' }}>
            <AlertTriangle size={20} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Delete Snippet</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: '0.875rem' }}>
          <p style={{ color: 'var(--secondary-text)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
            Are you sure you want to delete this snippet? This action cannot be undone.
          </p>

          <div
            style={{
              padding: '0.875rem 1rem',
              borderRadius: '8px',
              background: '#090E17',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--main-text)', fontSize: '0.9375rem' }}>
              {snippet.title}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginTop: '0.25rem' }}>
              {snippet.language} • {snippet.category}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--danger-color)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: '0.625rem 1.125rem',
              borderRadius: '8px',
            }}
            id="confirm-delete-btn"
          >
            <Trash2 size={16} />
            <span>{deleting ? 'Deleting...' : 'Delete Snippet'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
