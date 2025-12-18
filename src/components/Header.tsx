// ============================================
// HEADER COMPONENT - Navigasi dan User Menu
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User as UserType } from '@/types';

interface HeaderProps {
  user: UserType | null;
  onLogout: () => void;
  onSearch: (query: string) => void;
  onCreateClick: () => void;
}

export const Header = ({ user, onLogout, onSearch, onCreateClick }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-semibold hidden sm:block">Pinspire</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search pins..."
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 rounded-full bg-secondary border-0"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button onClick={onCreateClick} className="rounded-full gradient-warm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
                <div className="flex items-center gap-2 ml-2">
                  <button 
                    onClick={() => navigate('/profile')} 
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    <User className="h-4 w-4" />
                  </button>
                  <span className="text-sm hidden sm:block">{user.username}</span>
                  <Button variant="ghost" size="icon" onClick={onLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')} className="rounded-full">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
