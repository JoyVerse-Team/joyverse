const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class AdminAPI {
  private token: string | null = null;

  constructor() {
    // Try to get token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin_token');
    }
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success && data.token) {
      this.token = data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_token', data.token);
      }
    }

    return data;
  }

  async logout() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
  }

  async verifyToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/verify`, {
        headers: this.getHeaders(),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Token verification failed:', error);
      return { success: false, message: 'Token verification failed' };
    }
  }

  async getTherapists(status?: string) {
    const url = status 
      ? `${API_BASE_URL}/admin/therapists?status=${status}`
      : `${API_BASE_URL}/admin/therapists`;

    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    return await response.json();
  }

  async approveTherapist(therapistId: string) {
    const response = await fetch(`${API_BASE_URL}/admin/therapists/${therapistId}/approve`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    return await response.json();
  }

  async rejectTherapist(therapistId: string, reason?: string) {
    const response = await fetch(`${API_BASE_URL}/admin/therapists/${therapistId}/reject`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ reason }),
    });

    return await response.json();
  }

  async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: this.getHeaders(),
    });

    return await response.json();
  }
}

export const adminAPI = new AdminAPI();
