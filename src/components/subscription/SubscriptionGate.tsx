import { ReactNode } from 'react';

interface SubscriptionGateProps {
  children: ReactNode;
  requiredTier?: string;
  requiredTiers?: string[];
  featureName?: string;
  featureDescription?: string;
  benefits?: string[];
  showUpgradeButton?: boolean;
  upgradeRoute?: string;
  fallback?: ReactNode;
}

// Simplified SubscriptionGate - allows all content through
// Full implementation requires vip_affiliates table to be created
export function SubscriptionGate({ children }: SubscriptionGateProps) {
  return <>{children}</>;
}

// Hook placeholder
export function useSubscriptionAccess() {
  return {
    loading: false,
    hasAccess: true,
    userTier: null
  };
}

export default SubscriptionGate;
