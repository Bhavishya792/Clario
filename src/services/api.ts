const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('clario_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth methods
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company?: string;
    userType?: string;
  }) {
    const response = await this.request<{
      success: boolean;
      data: { user: any; token: string };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<{
      success: boolean;
      data: { user: any; token: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser() {
    return this.request<{
      success: boolean;
      data: { user: any };
    }>('/auth/me');
  }

  async updateProfile(profileData: any) {
    return this.request<{
      success: boolean;
      data: { user: any };
    }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Document methods
  async getDocuments(params?: {
    type?: string;
    status?: string;
    starred?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.request<{
      success: boolean;
      data: { documents: any[]; pagination: any };
    }>(`/documents?${queryParams.toString()}`);
  }

  async getDocument(id: string) {
    return this.request<{
      success: boolean;
      data: { document: any };
    }>(`/documents/${id}`);
  }

  async createDocument(documentData: {
    title: string;
    type: string;
    content: string;
    tags?: string[];
  }) {
    return this.request<{
      success: boolean;
      data: { document: any };
    }>('/documents', {
      method: 'POST',
      body: JSON.stringify(documentData),
    });
  }

  async uploadDocument(file: File, metadata: {
    title?: string;
    type?: string;
    tags?: string;
  }) {
    const formData = new FormData();
    formData.append('document', file);
    if (metadata.title) formData.append('title', metadata.title);
    if (metadata.type) formData.append('type', metadata.type);
    if (metadata.tags) formData.append('tags', metadata.tags);

    const response = await fetch(`${this.baseURL}/documents/upload`, {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data;
  }

  async analyzeDocument(id: string) {
    return this.request<{
      success: boolean;
      data: { analysis: any };
    }>(`/documents/${id}/analyze`, {
      method: 'POST',
    });
  }

  async simplifyDocument(id: string) {
    return this.request<{
      success: boolean;
      data: { simplified: string };
    }>(`/documents/${id}/simplify`, {
      method: 'POST',
    });
  }

  async checkClauses(id: string) {
    return this.request<{
      success: boolean;
      data: { clauseCheck: any };
    }>(`/documents/${id}/check-clauses`, {
      method: 'POST',
    });
  }

  async updateDocument(id: string, updateData: any) {
    return this.request<{
      success: boolean;
      data: { document: any };
    }>(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteDocument(id: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  // AI methods
  async chatWithAI(message: string, context?: string) {
    return this.request<{
      success: boolean;
      data: { response: string; timestamp: string };
    }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  async analyzeClauses(documentText: string) {
    return this.request<{
      success: boolean;
      data: { analysis: any };
    }>('/ai/analyze-clauses', {
      method: 'POST',
      body: JSON.stringify({ documentText }),
    });
  }

  async simplifyDocumentText(documentText: string) {
    return this.request<{
      success: boolean;
      data: { simplified: string };
    }>('/ai/simplify-document', {
      method: 'POST',
      body: JSON.stringify({ documentText }),
    });
  }

  async checkStandardClauses(documentText: string) {
    return this.request<{
      success: boolean;
      data: { clauseCheck: any };
    }>('/ai/check-standard-clauses', {
      method: 'POST',
      body: JSON.stringify({ documentText }),
    });
  }

  async generateDocument(type: string, parameters: any = {}) {
    return this.request<{
      success: boolean;
      data: { document: string };
    }>('/ai/generate-document', {
      method: 'POST',
      body: JSON.stringify({ type, parameters }),
    });
  }

  // Glossary methods
  async getGlossaryTerms(params?: {
    search?: string;
    category?: string;
    complexity?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.request<{
      success: boolean;
      data: { terms: any[]; pagination: any };
    }>(`/glossary?${queryParams.toString()}`);
  }

  async getGlossaryTerm(id: string) {
    return this.request<{
      success: boolean;
      data: { term: any; relatedTerms: any[] };
    }>(`/glossary/${id}`);
  }

  async searchGlossary(term: string) {
    return this.request<{
      success: boolean;
      data: { terms: any[] };
    }>(`/glossary/search/${encodeURIComponent(term)}`);
  }

  async getGlossaryCategories() {
    return this.request<{
      success: boolean;
      data: { categories: any[] };
    }>('/glossary/categories');
  }

  async getRandomTerms(count: number = 5) {
    return this.request<{
      success: boolean;
      data: { terms: any[] };
    }>(`/glossary/random/${count}`);
  }

  // Utility methods
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('clario_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('clario_token');
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export const apiService = new ApiService();
export default apiService;
