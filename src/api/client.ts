// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Client Class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Include cookies in requests
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  // Auth methods
  async register(userData: RegisterRequest): Promise<ApiResponse<{ user: User }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<{ user: User }>> {
    const response = await this.request<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request('/auth/me');
  }

  async updateProfile(updateData: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });

    return response;
  }

  // Team methods
  async getTeamMembers(): Promise<ApiResponse<{ teamMembers: TeamMemberAPI[] }>> {
    return this.request('/team/members');
  }

  async addTeamMember(memberData: Omit<TeamMemberAPI, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{ teamMember: TeamMemberAPI }>> {
    return this.request('/team/members', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  }

  async getTeamMember(id: string): Promise<ApiResponse<{ teamMember: TeamMemberAPI }>> {
    return this.request(`/team/members/${id}`);
  }

  async updateTeamMember(id: string, updateData: Partial<TeamMemberAPI>): Promise<ApiResponse<{ teamMember: TeamMemberAPI }>> {
    return this.request(`/team/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteTeamMember(id: string): Promise<ApiResponse> {
    return this.request(`/team/members/${id}`, {
      method: 'DELETE',
    });
  }

  // Authentication status check
  async checkAuth(): Promise<ApiResponse<{ user: User }>> {
    return this.request('/auth/me');
  }

  isAuthenticated(): boolean {
    // With httpOnly cookies, we can't check authentication status on client side
    // This method should be used in conjunction with checkAuth() API call
    // For now, we'll return true and let the server validate
    return true;
  }
}

// Types for API responses
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  timezone: string;
  workingHours: {
    start: number;
    end: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface TeamMemberAPI {
  id: string;
  name: string;
  role: string;
  timezone: string;
  workingHours: {
    start: number;
    end: number;
  };
  avatar?: string;
  userId?: string;
  teamId?: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  timezone: string;
  workingHours: {
    start: number;
    end: number;
  };
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types
export type {
  ApiResponse,
  User,
  TeamMemberAPI,
  LoginRequest,
  RegisterRequest,
};

// Export the API client class for testing or custom instances
export { ApiClient };
