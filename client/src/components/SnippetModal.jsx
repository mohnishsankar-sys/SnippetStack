import React, { useState, useEffect } from 'react';
import { X, Star, Plus, Check } from 'lucide-react';
import {
  PROGRAMMING_LANGUAGES,
  CATEGORIES,
} from '../utils/constants';

export default function SnippetModal({
  isOpen,
  mode = 'create', // 'create' | 'edit'
  snippetData = null,
  onClose,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'code',
    language: 'JavaScript',
    category: 'Web Development',
    content: '',
    tags: [],
    isFavorite: false,
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (snippetData && mode === 'edit') {
      setFormData({
        title: snippetData.title || '',
        description: snippetData.description || '',
        contentType: snippetData.contentType || 'code',
        language: snippetData.language || 'JavaScript',
        category: snippetData.category || 'Web Development',
        content: snippetData.content || '',
        tags: Array.isArray(snippetData.tags) ? [...snippetData.tags] : [],
        isFavorite: Boolean(snippetData.isFavorite),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        contentType: 'code',
        language: 'JavaScript',
        category: 'Web Development',
        content: '',
        tags: [],
        isFavorite: false,
      });
    }
    setErrors({});
    setTagInput('');
    setSubmitting(false);
  }, [snippetData, mode, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Title is required';
    } else if (formData.title.trim().length < 2) {
      errs.title = 'Title must be at least 2 characters';
    }

    if (!formData.content.trim()) {
      errs.content = 'Content (code or prompt) is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddTag = () => {
    const cleanTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (cleanTag && !formData.tags.includes(cleanTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, cleanTag],
      }));
    }
    setTagInput('');
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || submitting) return;

    // Flush any pending tag in input
    let finalTags = [...formData.tags];
    if (tagInput.trim()) {
      const cleanTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
      if (cleanTag && !finalTags.includes(cleanTag)) {
        finalTags.push(cleanTag);
      }
    }

    try {
      setSubmitting(true);
      await onSubmit({
        ...formData,
        tags: finalTags,
      });
      onClose();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err.message || 'Failed to save snippet',
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'edit' ? 'Edit Snippet' : 'Add New Snippet'}
          </h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-body" id="snippet-form">
          {errors.submit && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'var(--danger-bg)',
                border: '1px solid var(--danger-color)',
                color: 'var(--danger-color)',
                fontSize: '0.875rem',
              }}
            >
              {errors.submit}
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="snippet-title-input">
              Title <span className="required">*</span>
            </label>
            <input
              id="snippet-title-input"
              type="text"
              className="form-input"
              placeholder="e.g. Async Fetch with Retry Mechanism"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              autoFocus
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="snippet-desc-input">
              Description
            </label>
            <textarea
              id="snippet-desc-input"
              className="form-textarea"
              placeholder="Brief explanation of when and how to use this snippet..."
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Content Type, Language, Category Grid */}
          <div className="form-grid-2">
            {/* Content Type */}
            <div className="form-group">
              <label className="form-label" htmlFor="snippet-type-select">
                Content Type
              </label>
              <select
                id="snippet-type-select"
                className="form-select"
                value={formData.contentType}
                onChange={(e) => {
                  const type = e.target.value;
                  setFormData({
                    ...formData,
                    contentType: type,
                    language:
                      type === 'prompt'
                        ? 'Plain Text'
                        : type === 'command'
                        ? 'Bash'
                        : formData.language,
                  });
                }}
              >
                <option value="code">Code Snippet</option>
                <option value="prompt">AI Prompt</option>
                <option value="command">Terminal Command</option>
              </select>
            </div>

            {/* Language */}
            <div className="form-group">
              <label className="form-label" htmlFor="snippet-lang-select">
                Language / Format <span className="required">*</span>
              </label>
              <select
                id="snippet-lang-select"
                className="form-select"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              >
                {PROGRAMMING_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="snippet-cat-select">
              Category <span className="required">*</span>
            </label>
            <select
              id="snippet-cat-select"
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Code / Content */}
          <div className="form-group">
            <label className="form-label" htmlFor="snippet-content-input">
              {formData.contentType === 'prompt' ? 'Prompt Text' : 'Code / Commands'}{' '}
              <span className="required">*</span>
            </label>
            <textarea
              id="snippet-content-input"
              className="form-textarea code-editor-textarea"
              placeholder={
                formData.contentType === 'prompt'
                  ? 'Paste your reusable AI system prompt or instructions...'
                  : '// Paste or write your code here...'
              }
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
            />
            {errors.content && <span className="form-error">{errors.content}</span>}
          </div>

          {/* Tags Manager */}
          <div className="form-group">
            <label className="form-label" htmlFor="snippet-tags-input">
              Tags (Press Enter or comma to add)
            </label>
            <div className="tags-input-container">
              {formData.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  #{tag}
                  <span
                    className="tag-chip-remove"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </span>
                </span>
              ))}
              <input
                id="snippet-tags-input"
                type="text"
                className="tag-inner-input"
                placeholder={formData.tags.length === 0 ? 'e.g. react, hooks, api' : ''}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={handleAddTag}
              />
            </div>
          </div>

          {/* Favorite Toggle Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', paddingTop: '0.25rem' }}>
            <input
              type="checkbox"
              id="snippet-fav-check"
              checked={formData.isFavorite}
              onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
              style={{
                width: '18px',
                height: '18px',
                accentColor: 'var(--primary-accent)',
                cursor: 'pointer',
              }}
            />
            <label
              htmlFor="snippet-fav-check"
              style={{
                fontSize: '0.875rem',
                color: 'var(--main-text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Star
                size={15}
                style={{
                  color: formData.isFavorite ? 'var(--warning-color)' : 'var(--secondary-text)',
                }}
                fill={formData.isFavorite ? 'currentColor' : 'none'}
              />
              Mark as Favorite
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="snippet-form"
            className="btn-primary"
            disabled={submitting}
            id="save-snippet-submit-btn"
          >
            {submitting ? (
              <span>Saving...</span>
            ) : (
              <>
                <Check size={16} />
                <span>{mode === 'edit' ? 'Update Snippet' : 'Save Snippet'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
