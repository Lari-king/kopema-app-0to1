/**
 * Header - Pure UI Component
 * 
 * ⚠️ Authentication logic must be handled by parent.
 * This component only displays UI state.
 */

import { LogIn, UserPlus, Crown, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { UserProfileData } from '../types/ui';

interface HeaderProps {
  user?: UserProfileData | null;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onProfileClick?: () => void;
  onLogoClick?: () => void;
}

export function Header({
  user,
  onLoginClick,
  onSignupClick,
  onProfileClick,
  onLogoClick,
}: HeaderProps) {
  const membershipLabels = {
    free: 'Gratuit',
    plus: 'KOPEMA +',
    vip: 'VIP',
  };

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-yellow-500/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">K</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">KOPEMA</h1>
              <p className="text-yellow-400 text-xs">On s'occupe de vous</p>
            </div>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#pricing" className="text-zinc-300 hover:text-yellow-400 transition-colors text-sm">
              Tarifs
            </a>
            <a href="#about" className="text-zinc-300 hover:text-yellow-400 transition-colors text-sm">
              À propos
            </a>
            <a href="#advertiser" className="text-zinc-300 hover:text-yellow-400 transition-colors text-sm">
              Devenir annonceur
            </a>
          </nav>

          {/* Auth / User */}
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={onProfileClick}
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-zinc-900 border border-yellow-400/20 hover:border-yellow-400/40 transition-colors"
              >
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="hidden md:block text-left">
                  <div className="text-white text-sm font-medium">{user.name}</div>
                  <div className="text-yellow-400 text-xs flex items-center gap-1">
                    {user.membershipTier !== 'free' && <Crown className="w-3 h-3" />}
                    {membershipLabels[user.membershipTier]}
                  </div>
                </div>
              </button>
            ) : (
              <>
                <Button
                  onClick={onLoginClick}
                  variant="ghost"
                  className="text-zinc-300 hover:text-yellow-400 hover:bg-yellow-400/10"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Se connecter
                </Button>
                <Button
                  onClick={onSignupClick}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  S'inscrire
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
