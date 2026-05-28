const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getToken = (): string | null => localStorage.getItem('token');

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  error?: string;
}

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data: ApiResponse<T> = await response.json();
      if (!response.ok) {
        throw new ApiError(data.message || data.error || 'Request failed');
      }
      return data.data as T;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiError('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });
      const data: ApiResponse<T> = await response.json();
      if (!response.ok) {
        throw new ApiError(data.message || data.error || 'Request failed');
      }
      return data.data as T;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiError('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });
      const data: ApiResponse<T> = await response.json();
      if (!response.ok) {
        throw new ApiError(data.message || data.error || 'Request failed');
      }
      return data.data as T;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiError('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  async delete<T>(endpoint: string): Promise<T> {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data: ApiResponse<T> = await response.json();
      if (!response.ok) {
        throw new ApiError(data.message || data.error || 'Request failed');
      }
      return data.data as T;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiError('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });
      const data: ApiResponse<T> = await response.json();
      if (!response.ok) {
        throw new ApiError(data.message || data.error || 'Request failed');
      }
      return data.data as T;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiError('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  async uploadPut<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });
      const data: ApiResponse<T> = await response.json();
      if (!response.ok) {
        throw new ApiError(data.message || data.error || 'Request failed');
      }
      return data.data as T;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiError('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },
};
