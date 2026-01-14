/**
 * PricingCard - Pure UI Component
 * 
 * ⚠️ Subscription logic (payment, activation) must be handled externally.
 * This component only displays pricing information.
 */

import { Check, Crown, Sparkles } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MembershipTier } from '../types/ui';

interface PricingCardProps {
  tier: MembershipTier;
  price: string;
  features: string[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  onSelectPlan?: (tier: MembershipTier) => void;
}

export function PricingCard({
  tier,
  price,
  features,
  isPopular = false,
  isCurrentPlan = false,
  onSelectPlan,
}: PricingCardProps) {
  const tierConfig = {
    free: {
      name: 'Gratuit',
      icon: Sparkles,
      color: 'from-zinc-600 to-zinc-700',
    },
    plus: {
      name: 'KOPEMA +',
      icon: Crown,
      color: 'from-yellow-500 to-yellow-600',
    },
    vip: {
      name: 'KOPEMA VIP',
      icon: Crown,
      color: 'from-yellow-400 to-yellow-500',
    },
  };

  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <Card
      className={`relative overflow-hidden transition-transform hover:scale-105 ${
        isPopular
          ? 'bg-gradient-to-br from-zinc-900 via-zinc-900 to-yellow-900/20 border-yellow-400'
          : 'bg-zinc-900 border-zinc-800'
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 left-0 right-0">
          <Badge className="w-full rounded-none bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold border-0">
            ✨ Le plus populaire
          </Badge>
        </div>
      )}

      <div className={`p-8 ${isPopular ? 'pt-12' : ''}`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white text-xl font-semibold">{config.name}</h3>
            <p className="text-zinc-400 text-sm">
              {tier === 'free' && 'Pour découvrir'}
              {tier === 'plus' && 'Pour profiter plus'}
              {tier === 'vip' && 'Expérience premium'}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-white text-4xl font-bold">{price}</span>
            <span className="text-zinc-400 text-sm">/ mois</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <span className="text-zinc-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {isCurrentPlan ? (
          <Button
            disabled
            className="w-full bg-zinc-800 text-zinc-500 cursor-not-allowed"
          >
            Abonnement actuel
          </Button>
        ) : (
          <Button
            onClick={() => onSelectPlan?.(tier)}
            className={
              isPopular
                ? 'w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold'
                : 'w-full bg-zinc-800 hover:bg-zinc-700 text-white'
            }
          >
            {tier === 'free' ? 'Commencer gratuitement' : 'Choisir ce plan'}
          </Button>
        )}
      </div>
    </Card>
  );
}
