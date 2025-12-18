import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onCreateClick: () => void;
  onSearch: (query: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header = ({ onCreateClick, onSearch, activeTab, onTabChange }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleCreateClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    onCreateClick();
  };

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'boards', label: 'Boards' },
    { id: 'explore', label: 'Explore' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">M</span>
            </div>
            <span className="font-display text-xl font-semibold hidden sm:block">MoodBoardZ</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for inspiration..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 h-11 bg-secondary border-0 rounded-full focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCreateClick}
              className="rounded-full gradient-warm border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create</span>
            </Button>

            {/* User Menu or Login */}
            {user ? (
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => navigate('/profile')}
              >
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
              </Button>
            ) : (
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => navigate('/auth')}
              >
                Sign in
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 h-10 bg-secondary border-0 rounded-full"
              />
            </div>
          </form>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex gap-2 animate-fade-in">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};
