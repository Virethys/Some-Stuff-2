// ============================================
// TIPE DATA - Definisi struktur data aplikasi
// ============================================

// Tipe untuk Pin (gambar yang dipost)
export interface Pin {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  tags: string[];
  userId: string;
  createdAt: string;
}

// Tipe untuk User (pengguna)
export interface User {
  _id: string;
  email: string;
  username: string;
  avatar?: string;
  role?: 'user' | 'admin';
}
