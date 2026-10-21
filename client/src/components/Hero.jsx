import React from 'react';
import { Sparkles, Plus, ArrowDown, Terminal } from 'lucide-react';

export default function Hero({ onOpenAddModal, onScrollToLibrary }) {
  return (
    <section className="hero-section" aria-label="Hero Introduction">
      {/* Left Column: Heading and CTAs */}
      <div className="hero-left">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>Your developer workspace</span>
        </div>

        <h1 className="hero-title">
          Build faster. <span className="gradient-text">Save smarter.</span>
        </h1>

        <p className="hero-subtitle">
          Your personal library for reusable code, developer commands, and AI prompts.
          Save your best ideas and find them whenever you need them.
        </p>

        <div className="hero-cta-group">
          <button
            className="btn-primary"
            onClick={onOpenAddModal}
            id="hero-add-snippet-btn"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add New Snippet</span>
          </button>

          <button
            className="btn-secondary"
            onClick={onScrollToLibrary}
            id="hero-explore-btn"
          >
            <span>Explore Library</span>
            <ArrowDown size={16} />
          </button>
        </div>
      </div>

      {/* Right Column: Decorative Code Visual */}
      <div className="hero-right">
        <div className="hero-preview-card" aria-hidden="true">
          <div className="hero-card-header">
            <div className="hero-card-dots">
              <span className="hero-card-dot red"></span>
              <span className="hero-card-dot yellow"></span>
              <span className="hero-card-dot green"></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--secondary-text)' }}>
              <Terminal size={13} style={{ color: 'var(--primary-accent)' }} />
              <span>snippet.config.js</span>
            </div>
          </div>
          <div className="hero-card-body">
            <div><span style={{ color: 'var(--secondary-accent)' }}>const</span> <span style={{ color: '#818CF8' }}>snippet</span> = &#123;</div>
            <div style={{ paddingLeft: '1.25rem' }}><span style={{ color: '#94A3B8' }}>name:</span> <span style={{ color: 'var(--primary-accent)' }}>'SnippetStack'</span>,</div>
            <div style={{ paddingLeft: '1.25rem' }}><span style={{ color: '#94A3B8' }}>stack:</span> [<span style={{ color: 'var(--primary-accent)' }}>'React'</span>, <span style={{ color: 'var(--primary-accent)' }}>'Express'</span>, <span style={{ color: 'var(--primary-accent)' }}>'MongoDB'</span>],</div>
            <div style={{ paddingLeft: '1.25rem' }}><span style={{ color: '#94A3B8' }}>speed:</span> <span style={{ color: '#F59E0B' }}>'instant'</span>,</div>
            <div style={{ paddingLeft: '1.25rem' }}><span style={{ color: '#94A3B8' }}>purpose:</span> <span style={{ color: 'var(--primary-accent)' }}>'Empowering Developers'</span>,</div>
            <div>&#125;;</div>
            <div style={{ marginTop: '0.5rem', color: '#64748B' }}>// Ready to organize your workflow</div>
          </div>
        </div>
      </div>
    </section>
  );
}
