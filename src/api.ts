// ============================================
// API SERVICE - Menghubungkan Frontend ke Backend
// Ubah API_BASE_URL ke URL backend ExpressJS anda
// ============================================

import { Pin, User } from './types';

// URL Backend ExpressJS - ubah sesuai server anda
const API_BASE_URL = 'http://localhost:5000/api';

// Helper untuk mendapatkan token dari localStorage
const getToken = () => localStorage.getItem('token');

// Helper untuk request ke API
const request = async (endpoint: string, options?: RequestInit) => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message);
  }

  return response.json();
};

// ============================================
// AUTH API - Login & Register
// ============================================

export const authAPI = {
  // POST /api/auth/login
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // POST /api/auth/register
  register: async (email: string, password: string, username: string): Promise<{ user: User; token: string }> => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });
  },
};

// ============================================
// PIN API - CRUD operasi untuk Pin
// ============================================

export const pinAPI = {
  // GET /api/pins - Ambil semua pin
  getAll: async (): Promise<Pin[]> => {
    return request('/pins');
  },

  // GET /api/pins/:id - Ambil satu pin
  getById: async (id: string): Promise<Pin> => {
    return request(`/pins/${id}`);
  },

  // POST /api/pins - Buat pin baru (perlu login)
  create: async (pin: Omit<Pin, '_id' | 'createdAt' | 'userId'>): Promise<Pin> => {
    return request('/pins', {
      method: 'POST',
      body: JSON.stringify(pin),
    });
  },

  // PUT /api/pins/:id - Update pin (perlu login)
  update: async (id: string, updates: Partial<Pin>): Promise<Pin> => {
    return request(`/pins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // DELETE /api/pins/:id - Hapus pin (perlu login)
  delete: async (id: string): Promise<void> => {
    return request(`/pins/${id}`, { method: 'DELETE' });
  },
};

// ============================================
// UPLOAD API - Upload gambar
// ============================================

export const uploadAPI = {
  // POST /api/upload - Upload gambar, return URL
  uploadImage: async (file: File): Promise<string> => {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    return data.url;
  },
};
