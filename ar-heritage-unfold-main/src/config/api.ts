// API Configuration
// Automatically uses environment variable or falls back to localhost

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    register: `${API_BASE_URL}/api/auth/register`,
    login: `${API_BASE_URL}/api/auth/login`,
  },
  
  // Monuments
  monuments: {
    list: `${API_BASE_URL}/api/monuments`,
    details: (id: string | number) => `${API_BASE_URL}/api/monuments/${id}`,
    create: `${API_BASE_URL}/api/monuments`,
    update: (id: string | number) => `${API_BASE_URL}/api/monuments/${id}`,
    delete: (id: string | number) => `${API_BASE_URL}/api/monuments/${id}`,
  },
  
  // Monument Preservation
  preservation: {
    versions: (monumentId: string | number) => `${API_BASE_URL}/api/preservation/versions/${monumentId}`,
    createVersion: `${API_BASE_URL}/api/preservation/versions`,
    compareVersions: (id1: string | number, id2: string | number) => 
      `${API_BASE_URL}/api/preservation/versions/compare/${id1}/${id2}`,
    
    risks: (monumentId: string | number) => `${API_BASE_URL}/api/preservation/risks/${monumentId}`,
    createRisk: `${API_BASE_URL}/api/preservation/risks`,
    updateRisk: (id: string | number) => `${API_BASE_URL}/api/preservation/risks/${id}`,
    deleteRisk: (id: string | number) => `${API_BASE_URL}/api/preservation/risks/${id}`,
    riskSummary: (monumentId: string | number) => `${API_BASE_URL}/api/preservation/risks/summary/${monumentId}`,
    
    restorations: (monumentId: string | number) => `${API_BASE_URL}/api/preservation/restorations/${monumentId}`,
    createRestoration: `${API_BASE_URL}/api/preservation/restorations`,
    updateRestoration: (id: string | number) => `${API_BASE_URL}/api/preservation/restorations/${id}`,
    restorationStats: (monumentId: string | number) => `${API_BASE_URL}/api/preservation/restorations/stats/${monumentId}`,
    
    analytics: (monumentId: string | number) => `${API_BASE_URL}/api/preservation/analytics/${monumentId}`,
    dashboard: `${API_BASE_URL}/api/preservation/dashboard`,
  },
  
  // Experiences
  experiences: {
    list: `${API_BASE_URL}/api/experiences`,
    details: (id: string | number) => `${API_BASE_URL}/api/experiences/${id}`,
  },
  
  // Artifacts
  artifacts: {
    list: `${API_BASE_URL}/api/artifacts`,
    details: (id: string | number) => `${API_BASE_URL}/api/artifacts/${id}`,
    scan: `${API_BASE_URL}/api/artifacts/scan`,
  },
  
  // Health Check
  health: `${API_BASE_URL}/health`,
};

// Helper function to build URL with query parameters
export const buildUrl = (baseUrl: string, params?: Record<string, any>): string => {
  if (!params) return baseUrl;
  
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Helper function for fetch with error handling
export const apiFetch = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};

export default API_BASE_URL;
