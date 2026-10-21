export const CONTENT_TYPES = [
  { id: 'all', label: 'All Types' },
  { id: 'code', label: 'Code Snippets' },
  { id: 'prompt', label: 'AI Prompts' },
  { id: 'command', label: 'Commands' },
];

export const PROGRAMMING_LANGUAGES = [
  'Python',
  'JavaScript',
  'Java',
  'C',
  'C++',
  'HTML',
  'CSS',
  'SQL',
  'Bash',
  'JSON',
  'Other',
  'Plain Text',
];

export const CATEGORIES = [
  'Web Development',
  'AI & Machine Learning',
  'Database',
  'Algorithms & Data Structures',
  'DevOps',
  'Cybersecurity',
  'Productivity',
  'Other',
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Recently Added' },
  { value: 'updated', label: 'Recently Updated' },
  { value: 'title-asc', label: 'Title (A–Z)' },
  { value: 'title-desc', label: 'Title (Z–A)' },
  { value: 'oldest', label: 'Oldest First' },
];

export const LANGUAGE_STYLES = {
  Python: { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' },
  JavaScript: { bg: 'rgba(250, 204, 21, 0.15)', text: '#facc15', border: 'rgba(250, 204, 21, 0.3)' },
  Java: { bg: 'rgba(249, 115, 22, 0.15)', text: '#f97316', border: 'rgba(249, 115, 22, 0.3)' },
  C: { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
  'C++': { bg: 'rgba(236, 72, 153, 0.15)', text: '#f472b6', border: 'rgba(236, 72, 153, 0.3)' },
  HTML: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
  CSS: { bg: 'rgba(96, 165, 250, 0.15)', text: '#60a5fa', border: 'rgba(96, 165, 250, 0.3)' },
  SQL: { bg: 'rgba(45, 212, 191, 0.15)', text: '#2dd4bf', border: 'rgba(45, 212, 191, 0.3)' },
  Bash: { bg: 'rgba(74, 222, 128, 0.15)', text: '#4ade80', border: 'rgba(74, 222, 128, 0.3)' },
  JSON: { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' },
  'Plain Text': { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)' },
  Other: { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)' },
};
