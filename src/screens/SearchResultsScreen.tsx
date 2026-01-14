/**
 * SearchResultsScreen - Search results display UI
 * 
 * ⚠️ This screen only displays results passed as props.
 * Actual search/filtering logic must be handled by parent.
 */

import { useState } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { AdvertiserCard } from '../components/AdvertiserCard';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { UserProfileData, AdvertiserCardData, ServiceType } from '../types/ui';

interface SearchResultsScreenProps {
  user?: UserProfileData | null;
  results: AdvertiserCardData[];
  query: string;
  location: string;
  serviceType?: ServiceType;
  onLogin?: () => void;
  onSignup?: () => void;
  onProfileClick?: () => void;
  onSearch?: (query: string, location: string, serviceType?: ServiceType) => void;
  onViewAdvertiser?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onToggleComparison?: (id: string) => void;
  onQuickBook?: (id: string) => void;
  favoriteIds?: string[];
  comparisonIds?: string[];
}

export function SearchResultsScreen({
  user,
  results,
  query: initialQuery,
  location: initialLocation,
  serviceType: initialServiceType,
  onLogin,
  onSignup,
  onProfileClick,
  onSearch,
  onViewAdvertiser,
  onToggleFavorite,
  onToggleComparison,
  onQuickBook,
  favoriteIds = [],
  comparisonIds = [],
}: SearchResultsScreenProps) {
  // Local UI state
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [serviceType, setServiceType] = useState<ServiceType | undefined>(initialServiceType);

  const handleSearch = () => {
    onSearch?.(query, location, serviceType);
  };

  const serviceTypeLabels: Record<ServiceType, string> = {
    beauty: 'Beauté & Bien-être',
    food: 'Restauration',
    fashion: 'Mode & Couture',
    realestate: 'Immobilier',
  };

  return (
    <div className="min-h-screen bg-black">
      <Header
        user={user}
        onLoginClick={onLogin}
        onSignupClick={onSignup}
        onProfileClick={onProfileClick}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search bar */}
        <div className="mb-8">
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

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">
              {results.length > 0 ? 'Résultats de recherche' : 'Aucun résultat'}
            </h1>
            <p className="text-zinc-400">
              {results.length} prestataire{results.length !== 1 ? 's' : ''} trouvé
              {results.length !== 1 ? 's' : ''}
              {serviceType && ` en ${serviceTypeLabels[serviceType]}`}
              {location && ` à ${location}`}
            </p>
          </div>

          <Button
            variant="outline"
            className="border-zinc-700 hover:bg-zinc-800"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filtres
          </Button>
        </div>

        {/* Comparison bar */}
        {comparisonIds.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-yellow-400 font-semibold">
                  {comparisonIds.length} prestataire{comparisonIds.length > 1 ? 's' : ''} sélectionné
                  {comparisonIds.length > 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-2">
                  {comparisonIds.map((id) => {
                    const advertiser = results.find((a) => a.id === id);
                    return advertiser ? (
                      <Badge key={id} className="bg-zinc-900 text-white border-zinc-700">
                        {advertiser.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold">
                Comparer
              </Button>
            </div>
          </div>
        )}

        {/* Results grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((advertiser) => (
              <AdvertiserCard
                key={advertiser.id}
                data={advertiser}
                isFavorite={favoriteIds.includes(advertiser.id)}
                isInComparison={comparisonIds.includes(advertiser.id)}
                onViewDetails={onViewAdvertiser}
                onToggleFavorite={onToggleFavorite}
                onToggleComparison={onToggleComparison}
                onQuickBook={onQuickBook}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-white text-xl mb-2">Aucun résultat trouvé</h3>
            <p className="text-zinc-400 mb-6">
              Essayez de modifier vos critères de recherche
            </p>
            <Button
              onClick={() => {
                setQuery('');
                setLocation('');
                setServiceType(undefined);
                onSearch?.('', '', undefined);
              }}
              variant="outline"
              className="border-yellow-400/20 hover:bg-yellow-400/10 text-yellow-400"
            >
              Réinitialiser la recherche
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
