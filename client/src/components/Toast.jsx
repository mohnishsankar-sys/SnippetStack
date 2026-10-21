import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toast.type === 'error' ? 'error' : 'success'}`}
        >
          {toast.type === 'error' ? (
            <AlertCircle size={18} style={{ color: 'var(--danger-color)', flexShrink: 0 }} />
          ) : (
            <CheckCircle2 size={18} style={{ color: 'var(--primary-accent)', flexShrink: 0 }} />
          )}
          <span style={{ flex: 1, fontWeight: 500 }}>{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            style={{ color: 'var(--secondary-text)', display: 'flex', padding: '2px' }}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
