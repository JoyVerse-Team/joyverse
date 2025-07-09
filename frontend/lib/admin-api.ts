const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class AdminAPI {
  private adminData: any = null;

  constructor() {
    
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success && data.user) {
      this.adminData = data.user;
    }

    return data;
  }

  async logout() {
    this.adminData = null;
  }

  isLoggedIn() {
    return !!this.adminData;
  }

  getAdminData() {
    return this.adminData;
  }

  async getTherapists(status?: string) {
    if (!this.adminData) {
      throw new Error('Admin not logged in');
    }

    const url = status 
      ? `${API_BASE_URL}/admin/therapists?status=${status}&adminId=${this.adminData.id}`
      : `${API_BASE_URL}/admin/therapists?adminId=${this.adminData.id}`;

    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    return await response.json();
  }

  async approveTherapist(therapistId: string) {
    if (!this.adminData) {
      throw new Error('Admin not logged in');
    }

    const response = await fetch(`${API_BASE_URL}/admin/therapists/${therapistId}/approve`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ adminId: this.adminData.id }),
    });

    return await response.json();
  }

  async rejectTherapist(therapistId: string, reason?: string) {
    if (!this.adminData) {
      throw new Error('Admin not logged in');
    }

    const response = await fetch(`${API_BASE_URL}/admin/therapists/${therapistId}/reject`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ reason, adminId: this.adminData.id }),
    });

    return await response.json();
  }

  async getDashboardStats() {
    if (!this.adminData) {
      throw new Error('Admin not logged in');
    }

    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats?adminId=${this.adminData.id}`, {
      headers: this.getHeaders(),
    });

    return await response.json();
  }
}

export const adminAPI = new AdminAPI();
