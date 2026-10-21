import React from 'react';
import { Code, Layers, Star, Clock } from 'lucide-react';

export default function StatsCards({ stats, loading }) {
  const cards = [
    {
      id: 'total',
      label: 'Total Snippets',
      value: stats?.totalSnippets ?? 0,
      icon: Code,
      colorClass: 'emerald',
    },
    {
      id: 'languages',
      label: 'Programming Languages',
      value: stats?.languagesCount ?? 0,
      icon: Layers,
      colorClass: 'teal',
    },
    {
      id: 'favorites',
      label: 'Favorites',
      value: stats?.favoritesCount ?? 0,
      icon: Star,
      colorClass: 'amber',
    },
    {
      id: 'recent',
      label: 'Recently Added',
      value: stats?.recentlyAddedCount ?? 0,
      icon: Clock,
      colorClass: 'indigo',
    },
  ];

  return (
    <section className="stats-grid" aria-label="Library Statistics">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div key={card.id} className="stat-card">
            <div className="stat-info">
              <span className="stat-label">{card.label}</span>
              <span className="stat-value">
                {loading ? '...' : card.value}
              </span>
            </div>
            <div className={`stat-icon-wrapper ${card.colorClass}`}>
              <IconComponent size={22} strokeWidth={2.2} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
