const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to handle fetch responses and extract JSON data or thrown error
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.message || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Check backend server and MongoDB status
  async checkHealth() {
    return request('/health');
  },

  // Get snippets with optional filtering and sorting
  async getSnippets(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.language && filters.language !== 'All') params.append('language', filters.language);
    if (filters.contentType && filters.contentType !== 'all') params.append('contentType', filters.contentType);
    if (filters.favorite) params.append('favorite', 'true');
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/snippets${queryString}`);
  },

  // Get library stats
  async getStats() {
    return request('/snippets/stats');
  },

  // Get single snippet by ID
  async getSnippet(id) {
    return request(`/snippets/${id}`);
  },

  // Create new snippet
  async createSnippet(snippetData) {
    return request('/snippets', {
      method: 'POST',
      body: JSON.stringify(snippetData),
    });
  },

  // Update existing snippet
  async updateSnippet(id, snippetData) {
    return request(`/snippets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(snippetData),
    });
  },

  // Toggle or set favorite state
  async toggleFavorite(id, isFavorite) {
    return request(`/snippets/${id}/favorite`, {
      method: 'PATCH',
      body: JSON.stringify({ isFavorite }),
    });
  },

  // Delete snippet
  async deleteSnippet(id) {
    return request(`/snippets/${id}`, {
      method: 'DELETE',
    });
  },
};

export default api;
