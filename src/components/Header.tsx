
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onBack?: () => void;
}

const Header = ({ onBack }: HeaderProps) => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </Button>
            )}
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                PortfolioAI
              </h1>
              <Badge variant="secondary" className="text-xs">
                v2.0
              </Badge>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#tools" className="text-slate-600 hover:text-slate-900 transition-colors">
              Tools
            </a>
            <a href="#about" className="text-slate-600 hover:text-slate-900 transition-colors">
              About
            </a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <span className="text-sm text-slate-600 hidden sm:block">
                  {user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={signOut} className="text-slate-600 hover:text-slate-900">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                  Sign In
                </Button>
                <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                  <User className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
