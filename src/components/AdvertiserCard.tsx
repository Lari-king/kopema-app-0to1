/**
 * AdvertiserCard - Pure UI Component
 * 
 * ⚠️ This component is STATELESS and display-only.
 * All business logic (favorites, comparison, booking) must be handled by parent.
 */

import { Star, MapPin, Heart, GitCompare, Calendar } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AdvertiserCardData } from '../types/ui';

interface AdvertiserCardProps {
  data: AdvertiserCardData;
  isFavorite?: boolean;
  isInComparison?: boolean;
  onViewDetails?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onToggleComparison?: (id: string) => void;
  onQuickBook?: (id: string) => void;
}

export function AdvertiserCard({
  data,
  isFavorite = false,
  isInComparison = false,
  onViewDetails,
  onToggleFavorite,
  onToggleComparison,
  onQuickBook,
}: AdvertiserCardProps) {
  const getPriceLevelDisplay = (level: number) => {
    return '₣'.repeat(level);
  };

  return (
    <Card className="bg-zinc-900 border-yellow-400/20 overflow-hidden hover:border-yellow-400/40 transition-all group cursor-pointer">
      {/* Image with status badge */}
      <div className="relative h-48" onClick={() => onViewDetails?.(data.id)}>
        <img
          src={data.photo}
          alt={data.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge className={data.isOpen ? 'bg-green-500/90 text-white' : 'bg-zinc-800/90 text-zinc-300'}>
            {data.isOpen ? '🟢 Ouvert' : '⚫ Fermé'}
          </Badge>
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(data.id);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
              isFavorite
                ? 'bg-yellow-400 text-black'
                : 'bg-zinc-900/80 text-white hover:bg-zinc-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComparison?.(data.id);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
              isInComparison
                ? 'bg-yellow-400 text-black'
                : 'bg-zinc-900/80 text-white hover:bg-zinc-800'
            }`}
          >
            <GitCompare className="w-4 h-4" />
          </button>
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-lg mb-1">{data.name}</h3>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-medium">{data.rating.toFixed(1)}</span>
            </div>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-300">{getPriceLevelDisplay(data.priceLevel)}</span>
            <span className="text-zinc-400">•</span>
            <div className="flex items-center gap-1 text-zinc-300">
              <MapPin className="w-3 h-3" />
              <span className="text-xs">{data.district}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {data.tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs border-zinc-700 text-zinc-300"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Quick book button */}
        <Button
          onClick={() => onQuickBook?.(data.id)}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Réserver
        </Button>
      </div>
    </Card>
  );
}
