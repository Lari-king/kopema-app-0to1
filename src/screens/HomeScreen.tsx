/**
 * HomeScreen - Landing page UI
 * 
 * ⚠️ This is a pure UI screen with minimal local state (form inputs only).
 * All business logic (search, filtering, user management) must be handled by App.
 */

import { useState } from 'react';
import { Award, Users, TrendingUp, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { PricingCard } from '../components/PricingCard';
import { AdvertiserCard } from '../components/AdvertiserCard';
import { Badge } from '../ui/badge';
import { UserProfileData, AdvertiserCardData, ServiceType, MembershipTier } from '../types/ui';

interface HomeScreenProps {
  user?: UserProfileData | null;
  featuredAdvertisers?: AdvertiserCardData[];
  onLogin?: () => void;
  onSignup?: () => void;
  onProfileClick?: () => void;
  onSearch?: (query: string, location: string, serviceType?: ServiceType) => void;
  onSelectPlan?: (tier: MembershipTier) => void;
  onViewAdvertiser?: (id: string) => void;
}

export function HomeScreen({
  user,
  featuredAdvertisers = [],
  onLogin,
  onSignup,
  onProfileClick,
  onSearch,
  onSelectPlan,
  onViewAdvertiser,
}: HomeScreenProps) {
  // Local UI state only (not business logic)
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType | undefined>();

  const handleSearch = () => {
    onSearch?.(query, location, serviceType);
  };

  const pricingPlans = [
    {
      tier: 'free' as MembershipTier,
      price: '0 FCFA',
      features: [
        'Accès à tous les prestataires vérifiés',
        'Réservation en ligne',
        'Carte membre digitale',
        '5% de réduction chez les partenaires',
        'Support client par email',
      ],
    },
    {
      tier: 'plus' as MembershipTier,
      price: '1,500 FCFA',
      features: [
        'Tous les avantages gratuits',
        '10% de réduction chez tous les prestataires',
        'Accès prioritaire aux créneaux',
        'Service Gardien inclus',
        'Support client par chat',
        'Annulation gratuite 24h avant',
      ],
      isPopular: true,
    },
    {
      tier: 'vip' as MembershipTier,
      price: '5,000 FCFA',
      features: [
        'Tous les avantages KOPEMA +',
        '20% de réduction chez tous les prestataires',
        'Créneaux VIP exclusifs',
        'Support client prioritaire 24/7',
        'Carte membre physique premium',
        'Conciergerie personnalisée',
        'Accès aux événements exclusifs',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header
        user={user}
        onLoginClick={onLogin}
        onSignupClick={onSignup}
        onProfileClick={onProfileClick}
        onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(250, 204, 21, 0.1) 35px, rgba(250, 204, 21, 0.1) 70px)`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20 mb-4 text-sm px-4 py-2">
              ✨ On s'occupe de vous - Plateforme de confiance pour l'Afrique
            </Badge>
            <h1 className="text-white text-5xl md:text-6xl font-bold mb-6">
              Trouvez les <span className="text-yellow-400">meilleurs</span>
              <br />
              prestataires à Brazzaville
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Chaque prestataire sur KOPEMA a été testé et approuvé par notre équipe.
              Réservez en toute confiance, profitez de la qualité.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto">
            <SearchBar
              query={query}
              location={location}
              serviceType={serviceType}
              onQueryChange={setQuery}
              onLocationChange={setLocation}
              onServiceTypeChange={setServiceType}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-black" />
              </div>
              <div className="text-white text-4xl font-bold mb-2">500+</div>
              <div className="text-zinc-400">Prestataires vérifiés</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-black" />
              </div>
              <div className="text-white text-4xl font-bold mb-2">98%</div>
              <div className="text-zinc-400">Clients satisfaits</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-black" />
              </div>
              <div className="text-white text-4xl font-bold mb-2">10k+</div>
              <div className="text-zinc-400">Réservations réussies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Advertisers */}
      {featuredAdvertisers.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-white text-3xl font-bold mb-2">
                  Prestataires recommandés
                </h2>
                <p className="text-zinc-400">
                  Découvrez nos meilleurs prestataires ce mois-ci
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredAdvertisers.slice(0, 6).map((advertiser) => (
                <AdvertiserCard
                  key={advertiser.id}
                  data={advertiser}
                  onViewDetails={onViewAdvertiser}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-white text-3xl font-bold mb-4">
              Choisissez votre abonnement
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Profitez de réductions exclusives et d'avantages premium avec nos formules
              d'abonnement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <PricingCard
                key={plan.tier}
                tier={plan.tier}
                price={plan.price}
                features={plan.features}
                isPopular={plan.isPopular}
                isCurrentPlan={user?.membershipTier === plan.tier}
                onSelectPlan={onSelectPlan}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">K</span>
              </div>
              <div>
                <div className="text-white font-bold">KOPEMA</div>
                <div className="text-yellow-400 text-xs">On s'occupe de vous</div>
              </div>
            </div>

            <div className="flex gap-6 text-sm text-zinc-400">
              <a href="#" className="hover:text-yellow-400 transition-colors">
                CGU
              </a>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                Confidentialité
              </a>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-800 text-center text-zinc-500 text-sm">
            © 2026 KOPEMA. Tous droits réservés. Congo-Brazzaville.
          </div>
        </div>
      </footer>
    </div>
  );
}
