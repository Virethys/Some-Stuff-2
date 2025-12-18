import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      
      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await register(email, password, username);
      }

      if (result.success) {
        toast({
          title: isLogin ? 'Welcome back!' : 'Account created!',
          description: isLogin ? 'You have successfully logged in.' : 'Your account has been created successfully.',
        });
        navigate('/');
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Something went wrong',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full gradient-warm flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xl">MB</span>
            </div>
            <span className="font-display text-2xl font-semibold">MoodBoardZ</span>
          </div>

          {/* Header */}
          <div>
            <h1 className="font-display text-3xl font-bold">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin 
                ? 'Enter your credentials to access your account' 
                : 'Sign up to start saving and sharing inspiration'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                    className="pl-11 h-12 rounded-xl"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="pl-11 h-12 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-11 pr-11 h-12 rounded-xl"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl gradient-warm text-base font-medium"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isLogin ? 'Sign in' : 'Create account'}
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Toggle */}
          <div className="text-center">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 gradient-warm opacity-90" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white space-y-6 max-w-lg">
            <h2 className="font-display text-4xl font-bold">
              Discover endless inspiration
            </h2>
            <p className="text-lg text-white/90">
              Save ideas, organize them in boards, and share your creative vision with the world.
            </p>
            
            {/* Decorative pins */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded-2xl bg-white/20 backdrop-blur-sm",
                    i % 2 === 0 && "translate-y-4"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
