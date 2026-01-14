/**
 * BookingModal - Pure UI Component
 * 
 * ⚠️ This component handles UI state only (form inputs, steps).
 * Real booking logic (API calls, payment) must be handled by parent.
 */

import { useState } from 'react';
import { X, Calendar, MapPin, Car, Bike, Shield, ChevronRight, ChevronLeft } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { BookingFormData } from '../types/ui';

interface BookingModalProps {
  serviceName: string;
  providerName: string;
  basePrice: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: BookingFormData) => void;
  userMembershipTier?: 'free' | 'plus' | 'vip';
}

export function BookingModal({
  serviceName,
  providerName,
  basePrice,
  isOpen,
  onClose,
  onSubmit,
  userMembershipTier = 'free',
}: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    date: '',
    time: '',
    serviceLocation: 'advertiser',
    needsTransport: false,
    guardianService: false,
  });

  if (!isOpen) return null;

  const canUseGuardian = userMembershipTier === 'plus' || userMembershipTier === 'vip';

  const calculateTotal = () => {
    let total = basePrice;
    if (formData.needsTransport) {
      total += formData.transportType === 'taxi' ? 5000 : 2000;
    }
    if (formData.guardianService) {
      total += 3000;
    }
    return total;
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    onSubmit?.(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-zinc-900 border-yellow-400/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-yellow-400/20 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-white text-xl font-semibold">{serviceName}</h2>
            <p className="text-zinc-400 text-sm">{providerName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded ${
                  s <= step ? 'bg-yellow-400' : 'bg-zinc-800'
                }`}
                style={{ marginRight: s < 3 ? '8px' : '0' }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className={step >= 1 ? 'text-yellow-400' : 'text-zinc-500'}>Détails</span>
            <span className={step >= 2 ? 'text-yellow-400' : 'text-zinc-500'}>Transport</span>
            <span className={step >= 3 ? 'text-yellow-400' : 'text-zinc-500'}>Confirmation</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Booking details */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-zinc-300">Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-zinc-300">Heure</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-zinc-300 mb-3 block">Lieu de prestation</Label>
                <RadioGroup
                  value={formData.serviceLocation}
                  onValueChange={(value: 'advertiser' | 'client') =>
                    setFormData({ ...formData, serviceLocation: value })
                  }
                >
                  <div className="flex items-center space-x-2 p-4 rounded-lg bg-zinc-800 border border-zinc-700 cursor-pointer">
                    <RadioGroupItem value="advertiser" id="advertiser" />
                    <Label htmlFor="advertiser" className="flex-1 cursor-pointer text-white">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-yellow-400" />
                        Chez le prestataire
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg bg-zinc-800 border border-zinc-700 cursor-pointer mt-2">
                    <RadioGroupItem value="client" id="client" />
                    <Label htmlFor="client" className="flex-1 cursor-pointer text-white">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-yellow-400" />
                        À mon domicile
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.serviceLocation === 'client' && (
                <div>
                  <Label className="text-zinc-300">Adresse</Label>
                  <Input
                    value={formData.clientAddress || ''}
                    onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                    placeholder="Votre adresse complète"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: Transport & Guardian */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800 border border-zinc-700">
                <div>
                  <div className="text-white font-medium mb-1">Transport</div>
                  <div className="text-zinc-400 text-sm">Besoin d'un transport ?</div>
                </div>
                <Switch
                  checked={formData.needsTransport}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, needsTransport: checked })
                  }
                />
              </div>

              {formData.needsTransport && (
                <RadioGroup
                  value={formData.transportType}
                  onValueChange={(value: 'taxi' | 'moto') =>
                    setFormData({ ...formData, transportType: value })
                  }
                >
                  <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800 border border-zinc-700 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="taxi" id="taxi" />
                      <Label htmlFor="taxi" className="cursor-pointer">
                        <div className="flex items-center gap-2 text-white">
                          <Car className="w-5 h-5 text-yellow-400" />
                          Taxi
                        </div>
                      </Label>
                    </div>
                    <span className="text-zinc-300">+5,000 FCFA</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800 border border-zinc-700 cursor-pointer mt-2">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="moto" id="moto" />
                      <Label htmlFor="moto" className="cursor-pointer">
                        <div className="flex items-center gap-2 text-white">
                          <Bike className="w-5 h-5 text-yellow-400" />
                          Moto-taxi
                        </div>
                      </Label>
                    </div>
                    <span className="text-zinc-300">+2,000 FCFA</span>
                  </div>
                </RadioGroup>
              )}

              {canUseGuardian && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20">
                  <div>
                    <div className="text-white font-medium mb-1 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-yellow-400" />
                      Service Gardien
                    </div>
                    <div className="text-zinc-400 text-sm">
                      Une personne de confiance sera informée de votre rendez-vous
                    </div>
                    <Badge className="mt-2 bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                      +3,000 FCFA
                    </Badge>
                  </div>
                  <Switch
                    checked={formData.guardianService}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, guardianService: checked })
                    }
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-zinc-800 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">Récapitulatif</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Service</span>
                    <span className="text-white">{serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Prestataire</span>
                    <span className="text-white">{providerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Date & Heure</span>
                    <span className="text-white">{formData.date} à {formData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Lieu</span>
                    <span className="text-white">
                      {formData.serviceLocation === 'advertiser' ? 'Chez le prestataire' : 'À domicile'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-zinc-700 my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Prix du service</span>
                    <span className="text-white">{basePrice.toLocaleString()} FCFA</span>
                  </div>
                  {formData.needsTransport && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Transport ({formData.transportType})</span>
                      <span className="text-white">
                        {(formData.transportType === 'taxi' ? 5000 : 2000).toLocaleString()} FCFA
                      </span>
                    </div>
                  )}
                  {formData.guardianService && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Service Gardien</span>
                      <span className="text-white">3,000 FCFA</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-700 my-4" />

                <div className="flex justify-between text-lg">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-yellow-400 font-bold">
                    {calculateTotal().toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">
                  ⚠️ En environnement de production, le paiement serait traité ici via Stripe,
                  Mobile Money, ou autre solution de paiement sécurisée.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-zinc-900 border-t border-yellow-400/20 p-6 flex items-center justify-between">
          <div>
            {step > 1 && (
              <Button
                onClick={handleBack}
                variant="ghost"
                className="text-zinc-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            )}
          </div>
          <div className="text-right">
            <div className="text-zinc-400 text-sm mb-2">Total</div>
            <div className="text-yellow-400 text-2xl font-bold">
              {calculateTotal().toLocaleString()} FCFA
            </div>
          </div>
          <div>
            {step < 3 ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold"
              >
                Suivant
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold"
              >
                Confirmer la réservation
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
