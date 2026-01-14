/**
 * SearchBar - Pure UI Component
 * 
 * ⚠️ This component only handles UI interactions.
 * Search logic, filtering, and data fetching must be handled by parent.
 */

import { Search, MapPin, Filter } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ServiceType } from '../types/ui';

interface SearchBarProps {
  query: string;
  location: string;
  serviceType?: ServiceType;
  onQueryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onServiceTypeChange: (value: ServiceType | undefined) => void;
  onSearch: () => void;
  onFilterClick?: () => void;
}

export function SearchBar({
  query,
  location,
  serviceType,
  onQueryChange,
  onLocationChange,
  onServiceTypeChange,
  onSearch,
  onFilterClick,
}: SearchBarProps) {
  const serviceTypes: { value: ServiceType; label: string }[] = [
    { value: 'beauty', label: 'Beauté' },
    { value: 'food', label: 'Restauration' },
    { value: 'fashion', label: 'Mode' },
    { value: 'realestate', label: 'Immobilier' },
  ];

  return (
    <div className="bg-zinc-900 border border-yellow-400/20 rounded-2xl p-6 shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* What */}
        <div className="md:col-span-2">
          <label className="text-zinc-400 text-sm mb-2 block">Que cherchez-vous ?</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <Input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              placeholder="Coiffure, appartement, restaurant..."
              className="pl-10 bg-zinc-800 border-yellow-500/20 text-white h-12 placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Where */}
        <div>
          <label className="text-zinc-400 text-sm mb-2 block">Où ?</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <Input
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              placeholder="Quartier, ville..."
              className="pl-10 bg-zinc-800 border-yellow-500/20 text-white h-12 placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Search button */}
        <div className="flex items-end gap-2">
          <Button
            onClick={onSearch}
            className="flex-1 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold"
          >
            <Search className="w-5 h-5 mr-2" />
            Rechercher
          </Button>
          <Button
            onClick={onFilterClick}
            variant="outline"
            className="h-12 px-4 border-zinc-700 hover:bg-zinc-800"
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Service type pills */}
      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => onServiceTypeChange(undefined)}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            !serviceType
              ? 'bg-yellow-400 text-black font-medium'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          Tout
        </button>
        {serviceTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onServiceTypeChange(type.value)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              serviceType === type.value
                ? 'bg-yellow-400 text-black font-medium'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}
