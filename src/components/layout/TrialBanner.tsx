import React from 'react';
import { Clock, Crown, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TrialBannerProps {
  onUpgrade: () => void;
  onDismiss?: () => void;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({ onUpgrade, onDismiss }) => {
  const { company } = useAuth();

  if (!company?.isTrialActive || !company?.trialEndDate) {
    return null;
  }

  const trialEndDate = new Date(company.trialEndDate);
  const now = new Date();
  const daysLeft = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // Don't show if trial has expired
  if (daysLeft <= 0) {
    return null;
  }

  const getUrgencyColor = () => {
    if (daysLeft <= 1) return 'bg-red-600';
    if (daysLeft <= 3) return 'bg-orange-600';
    return 'bg-blue-600';
  };

  const getUrgencyText = () => {
    if (daysLeft <= 1) return 'Último dia!';
    if (daysLeft <= 3) return 'Poucos dias restantes!';
    return 'Período de teste';
  };

  return (
    <div className={`${getUrgencyColor()} text-white p-3 relative`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span className="font-semibold">{getUrgencyText()}</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm opacity-90">
                {daysLeft === 1 
                  ? `Seu teste gratuito expira hoje!` 
                  : `${daysLeft} dias restantes no seu teste gratuito`
                }
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onUpgrade}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
            >
              <Crown size={16} />
              Fazer Upgrade
              <ArrowRight size={16} />
            </button>
            
            {onDismiss && daysLeft > 1 && (
              <button
                onClick={onDismiss}
                className="text-white hover:text-gray-200 p-1"
                title="Dispensar"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile version */}
        <div className="sm:hidden mt-2">
          <span className="text-sm opacity-90">
            {daysLeft === 1 
              ? `Seu teste gratuito expira hoje!` 
              : `${daysLeft} dias restantes no seu teste gratuito`
            }
          </span>
        </div>
      </div>
    </div>
  );
};