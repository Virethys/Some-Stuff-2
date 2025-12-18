import { Board, Pin, Category, Comment } from '@/types/MoodBoardZ';

// API Base URL - ganti dengan URL backend Anda
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper untuk mendapatkan token
const getToken = () => localStorage.getItem('auth_token');

// Helper untuk headers
const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
});

// ==================== BOARDS ====================

export const getBoards = async (): Promise<Board[]> => {
  const res = await fetch(`${API_URL}/boards`, { headers: headers() });
  if (!res.ok) throw new Error('Gagal mengambil boards');
  return res.json();
};

export const getBoard = async (id: string): Promise<Board> => {
  const res = await fetch(`${API_URL}/boards/${id}`, { headers: headers() });
  if (!res.ok) throw new Error('Board tidak ditemukan');
  return res.json();
};

export const createBoard = async (data: Partial<Board>): Promise<Board> => {
  const res = await fetch(`${API_URL}/boards`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Gagal membuat board');
  return res.json();
};

export const updateBoard = async (id: string, data: Partial<Board>): Promise<Board> => {
  const res = await fetch(`${API_URL}/boards/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Gagal update board');
  return res.json();
};

export const deleteBoard = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/boards/${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok) throw new Error('Gagal hapus board');
};

// ==================== PINS ====================

export const getPins = async (filters?: { boardId?: string; moods?: string[] }): Promise<Pin[]> => {
  const params = new URLSearchParams();
  if (filters?.boardId) params.append('boardId', filters.boardId);
  if (filters?.moods && filters.moods.length > 0) {
    params.append('moods', filters.moods.join(','));
  }
  
  const res = await fetch(`${API_URL}/pins?${params}`, { headers: headers() });
  if (!res.ok) throw new Error('Gagal mengambil pins');
  return res.json();
};

export const getPin = async (id: string): Promise<Pin> => {
  const res = await fetch(`${API_URL}/pins/${id}`, { headers: headers() });
  if (!res.ok) throw new Error('Pin tidak ditemukan');
  return res.json();
};

export const createPin = async (data: Partial<Pin>): Promise<Pin> => {
  const res = await fetch(`${API_URL}/pins`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Gagal membuat pin');
  return res.json();
};

export const updatePin = async (id: string, data: Partial<Pin>): Promise<Pin> => {
  const res = await fetch(`${API_URL}/pins/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Gagal update pin');
  return res.json();
};

export const deletePin = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/pins/${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok) throw new Error('Gagal hapus pin');
};

// ==================== COMMENTS ====================

export const getComments = async (pinId: string): Promise<Comment[]> => {
  const res = await fetch(`${API_URL}/comments/pin/${pinId}`, { headers: headers() });
  if (!res.ok) throw new Error('Gagal mengambil comments');
  return res.json();
};

export const createComment = async (pinId: string, text: string): Promise<Comment> => {
  const res = await fetch(`${API_URL}/comments/pin/${pinId}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Gagal menambah comment');
  return res.json();
};

export const deleteComment = async (commentId: string): Promise<void> => {
  const res = await fetch(`${API_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok) throw new Error('Gagal hapus comment');
};

// ==================== UPLOAD ====================

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: { ...(getToken() && { Authorization: `Bearer ${getToken()}` }) },
    body: formData,
  });
  if (!res.ok) throw new Error('Gagal upload gambar');
  const data = await res.json();
  return data.imageUrl;
};

// ==================== CATEGORIES (Static) ====================

export const getCategories = async (): Promise<Category[]> => {
  return [
    { _id: '1', name: 'Design', slug: 'design', color: '#FF6B6B' },
    { _id: '2', name: 'Photography', slug: 'photography', color: '#4ECDC4' },
    { _id: '3', name: 'Art', slug: 'art', color: '#FFE66D' },
    { _id: '4', name: 'Architecture', slug: 'architecture', color: '#95E1D3' },
    { _id: '5', name: 'Nature', slug: 'nature', color: '#A8E6CF' },
  ];
};

// ==================== AUTH ====================

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login gagal');
  return res.json();
};

export const register = async (username: string, email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) throw new Error('Registrasi gagal');
  return res.json();
};

// Export semua sebagai object untuk backward compatibility
export const api = {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  getPins,
  getPin,
  createPin,
  updatePin,
  deletePin,
  getComments,
  createComment,
  deleteComment,
  uploadImage,
  getCategories,
  login,
  register,
};
