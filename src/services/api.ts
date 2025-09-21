const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('clario_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // For demo purposes, always use mock responses
    console.log(`Mock API call to: ${endpoint}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return mock responses based on endpoint
    if (endpoint.includes('/auth/login') || endpoint.includes('/auth/register')) {
      return {
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: {
            _id: 'mock-user-id',
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@clario.com',
            subscription: 'pro'
          }
        }
      } as T;
    }
    
    if (endpoint.includes('/dashboard/stats')) {
      return {
        success: true,
        data: {
          stats: {
            documents: 5,
            deadlines: 8,
            upcoming: 3,
            overdue: 1,
            highPriority: 2,
            compliance: 85
          },
          recentDocuments: [
            { title: 'Employment Contract', type: 'Contract', updatedAt: new Date() },
            { title: 'NDA Template', type: 'Legal Agreement', updatedAt: new Date() }
          ],
          upcomingDeadlines: [
            { title: 'GST Filing', dueDate: '2025-10-15', priority: 'high' },
            { title: 'Trademark Renewal', dueDate: '2025-11-01', priority: 'medium' }
          ]
        }
      } as T;
    }
    
    if (endpoint.includes('/dashboard/health-check')) {
      return {
        success: true,
        data: {
          riskScore: 75,
          recommendations: [
            {
              type: 'medium',
              title: 'Review High Priority Deadlines',
              description: 'You have 2 high-priority deadlines approaching.'
            }
          ],
          summary: {
            overdueDeadlines: 1,
            highPriorityDeadlines: 2,
            totalDeadlines: 8,
            documentCount: 5
          }
        }
      } as T;
    }
    
    if (endpoint.includes('/deadlines')) {
      return {
        success: true,
        data: {
          deadlines: [
            {
              _id: '1',
              title: 'GST Filing - Q3 2024',
              description: 'Quarterly GST return filing',
              dueDate: '2025-10-15',
              priority: 'high',
              status: 'upcoming',
              category: 'tax-compliance'
            },
            {
              _id: '2',
              title: 'Trademark Renewal',
              description: 'Renewal of trademark registration',
              dueDate: '2025-11-01',
              priority: 'medium',
              status: 'upcoming',
              category: 'intellectual-property'
            }
          ],
          pagination: { current: 1, pages: 1, total: 2 }
        }
      } as T;
    }
    
    if (endpoint.includes('/documents')) {
      return {
        success: true,
        data: {
          documents: [
            {
              _id: '1',
              title: 'Employment Contract Template',
              type: 'Contract',
              status: 'active',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              _id: '2',
              title: 'NDA - Standard Form',
              type: 'Legal Agreement',
              status: 'active',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        }
      } as T;
    }
    
    // Default mock response
    return {
      success: true,
      data: {},
      message: 'Mock response - backend not running'
    } as T;
  }

  // Auth methods
  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: any) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Dashboard methods
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  async generateHealthCheck() {
    return this.request('/dashboard/health-check');
  }

  // Deadline methods
  async getDeadlines(params?: any) {
    return this.request('/deadlines');
  }

  async getDeadline(id: string) {
    return this.request(`/deadlines/${id}`);
  }

  async createDeadline(deadlineData: any) {
    return this.request('/deadlines', {
      method: 'POST',
      body: JSON.stringify(deadlineData),
    });
  }

  async updateDeadline(id: string, updateData: any) {
    return this.request(`/deadlines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteDeadline(id: string) {
    return this.request(`/deadlines/${id}`, {
      method: 'DELETE',
    });
  }

  async getUpcomingDeadlines(limit: number = 5) {
    return this.request(`/deadlines/upcoming?limit=${limit}`);
  }

  async getOverdueDeadlines() {
    return this.request('/deadlines/overdue');
  }

  // Document methods
  async getDocuments() {
    return this.request('/documents');
  }

  async uploadDocument(file: File, metadata: any) {
    return this.request('/documents/upload', {
      method: 'POST',
      body: JSON.stringify({ ...metadata, content: 'Mock document content' }),
    });
  }

  // AI methods (not used in simplified version)
  async chatWithAI(message: string, documentText?: string) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, documentText }),
    });
  }

  async analyzeClauses(documentText: string) {
    return this.request('/ai/analyze-clauses', {
      method: 'POST',
      body: JSON.stringify({ documentText }),
    });
  }

  async checkStandardClauses(documentText: string) {
    return this.request('/ai/check-clauses', {
      method: 'POST',
      body: JSON.stringify({ documentText }),
    });
  }

  async simplifyDocumentText(documentText: string) {
    return this.request('/ai/simplify', {
      method: 'POST',
      body: JSON.stringify({ documentText }),
    });
  }

  // Glossary methods (not used in simplified version)
  async getGlossaryTerms(params?: any) {
    return this.request('/glossary');
  }

  async getGlossaryCategories() {
    return this.request('/glossary/categories');
  }

  async getGlossaryTerm(id: string) {
    return this.request(`/glossary/${id}`);
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