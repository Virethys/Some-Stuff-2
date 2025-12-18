export interface Pin {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  boardId: string;
  tags: string[];
  moods?: string[];
  createdAt: string;
  userId: string;
}

export interface Board {
  _id: string;
  name: string;
  description?: string;
  coverImage?: string;
  isPrivate: boolean;
  pins: Pin[];
  createdAt: string;
  userId: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  color: string;
}

export interface Comment {
  _id: string;
  text: string;
  pinId: string;
  userId: {
    _id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
}

export type Mood = 
  | 'minimal' 
  | 'vibrant' 
  | 'dark' 
  | 'pastel' 
  | 'vintage' 
  | 'modern'
  | 'cozy'
  | 'elegant'
  | 'playful'
  | 'rustic'
  | 'bohemian'
  | 'industrial'
  | 'tropical'
  | 'romantic'
  | 'urban'
  | 'nature';

export const MOODS: { value: Mood; label: string; color: string }[] = [
  { value: 'minimal', label: 'Minimal', color: '#E5E5E5' },
  { value: 'vibrant', label: 'Vibrant', color: '#FF6B6B' },
  { value: 'dark', label: 'Dark', color: '#2D3436' },
  { value: 'pastel', label: 'Pastel', color: '#DFE6E9' },
  { value: 'vintage', label: 'Vintage', color: '#FFEAA7' },
  { value: 'modern', label: 'Modern', color: '#74B9FF' },
  { value: 'cozy', label: 'Cozy', color: '#D4A574' },
  { value: 'elegant', label: 'Elegant', color: '#C9B1FF' },
  { value: 'playful', label: 'Playful', color: '#FF9FF3' },
  { value: 'rustic', label: 'Rustic', color: '#A0522D' },
  { value: 'bohemian', label: 'Bohemian', color: '#E07C24' },
  { value: 'industrial', label: 'Industrial', color: '#708090' },
  { value: 'tropical', label: 'Tropical', color: '#00CED1' },
  { value: 'romantic', label: 'Romantic', color: '#FF69B4' },
  { value: 'urban', label: 'Urban', color: '#4A4A4A' },
  { value: 'nature', label: 'Nature', color: '#228B22' },
];
