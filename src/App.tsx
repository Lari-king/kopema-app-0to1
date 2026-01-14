/**
 * App - Minimal demonstration App
 * 
 * ⚠️ THIS IS A UI PROTOTYPE ONLY
 * 
 * This App.tsx demonstrates how the UI components work together,
 * but contains NO real business logic.
 * 
 * In a production app, you would replace this with:
 * - React Router for routing
 * - Zustand/Redux for state management
 * - React Query for API data fetching
 * - Real authentication provider
 * - Backend API integration
 */

import { useState } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { SearchResultsScreen } from './screens/SearchResultsScreen';
import { BookingModal } from './components/BookingModal';
import { AdvertiserCardData, ServiceType, MembershipTier, UserProfileData } from './types/ui';

// ⚠️ FIXTURE DATA FOR UI DEMONSTRATION ONLY
// In production, this would come from your API
const FIXTURE_ADVERTISERS: AdvertiserCardData[] = [
  {
    id: '1',
    name: 'Salon Élégance',
    photo: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=400&fit=crop',
    rating: 8.5,
    priceLevel: 2,
    district: 'Poto-Poto',
    isOpen: true,
    tags: ['Coiffure', 'Tresses', 'Brushing'],
  },
  {
    id: '2',
    name: 'Beauté Divine',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
    rating: 9.2,
    priceLevel: 3,
    district: 'Bacongo',
    isOpen: true,
    tags: ['Soins visage', 'Manucure', 'Maquillage'],
  },
  {
    id: '3',
    name: 'Chez Maman Thérèse',
    photo: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=400&fit=crop',
    rating: 8.7,
    priceLevel: 1,
    district: 'Bacongo',
    isOpen: true,
    tags: ['Cuisine congolaise', 'Grillades'],
  },
];

function App() {
  // Minimal UI state (not business logic)
  const [currentScreen, setCurrentScreen] = useState<'home' | 'search'>('home');
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [searchResults, setSearchResults] = useState<AdvertiserCardData[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    serviceName: string;
    providerName: string;
    price: number;
  } | null>(null);

  // ⚠️ UI-only handlers (not real business logic)
  const handleLogin = () => {
    // In production: open login modal, call auth API
    alert('🔒 Authentification : À implémenter avec un vrai système d\'auth (OAuth, JWT, etc.)');
    // Demo: just set a fake user
    setUser({
      name: 'Marie Dupont',
      email: 'marie@example.com',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      membershipTier: 'plus',
      memberCardNumber: 'KOP-2024-001234',
    });
  };

  const handleSignup = () => {
    // In production: open signup modal, call auth API
    alert('📝 Inscription : À implémenter avec un vrai système d\'auth');
  };

  const handleSearch = (query: string, location: string, serviceType?: ServiceType) => {
    // In production: call search API
    // For demo: just filter fixtures
    setSearchResults(FIXTURE_ADVERTISERS);
    setCurrentScreen('search');
  };

  const handleSelectPlan = (tier: MembershipTier) => {
    // In production: redirect to Stripe Checkout or payment gateway
    alert(`💳 Paiement : À implémenter avec Stripe, Mobile Money, etc. pour le plan ${tier}`);
  };

  const handleQuickBook = (id: string) => {
    const advertiser = FIXTURE_ADVERTISERS.find((a) => a.id === id);
    if (advertiser) {
      setBookingModal({
        isOpen: true,
        serviceName: 'Service exemple',
        providerName: advertiser.name,
        price: 25000,
      });
    }
  };

  const handleBookingSubmit = (data: any) => {
    // In production: call booking API, process payment
    console.log('Booking data:', data);
    alert('✅ Réservation : À implémenter avec API backend + paiement sécurisé');
    setBookingModal(null);
  };

  const handleToggleFavorite = (id: string) => {
    if (!user) {
      alert('🔐 Connexion requise pour gérer les favoris');
      return;
    }
    // In production: call favorites API
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleToggleComparison = (id: string) => {
    // In production: might sync with localStorage or API
    setComparisonIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((cid) => cid !== id);
      } else if (prev.length >= 4) {
        alert('Maximum 4 prestataires en comparaison');
        return prev;
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <div className="dark">
      {currentScreen === 'home' && (
        <HomeScreen
          user={user}
          featuredAdvertisers={FIXTURE_ADVERTISERS}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onProfileClick={() => alert('👤 Profil : À implémenter')}
          onSearch={handleSearch}
          onSelectPlan={handleSelectPlan}
          onViewAdvertiser={(id) => alert(`📄 Détail annonceur ${id} : À implémenter`)}
        />
      )}

      {currentScreen === 'search' && (
        <SearchResultsScreen
          user={user}
          results={searchResults}
          query=""
          location=""
          onLogin={handleLogin}
          onSignup={handleSignup}
          onProfileClick={() => alert('👤 Profil : À implémenter')}
          onSearch={handleSearch}
          onViewAdvertiser={(id) => alert(`📄 Détail annonceur ${id} : À implémenter`)}
          onToggleFavorite={handleToggleFavorite}
          onToggleComparison={handleToggleComparison}
          onQuickBook={handleQuickBook}
          favoriteIds={favoriteIds}
          comparisonIds={comparisonIds}
        />
      )}

      {bookingModal && (
        <BookingModal
          serviceName={bookingModal.serviceName}
          providerName={bookingModal.providerName}
          basePrice={bookingModal.price}
          isOpen={bookingModal.isOpen}
          onClose={() => setBookingModal(null)}
          onSubmit={handleBookingSubmit}
          userMembershipTier={user?.membershipTier}
        />
      )}
    </div>
  );
}

export default App;
