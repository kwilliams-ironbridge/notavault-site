import { REVENUECAT_IOS_KEY } from '@/config/env';

export type Plan = 'annual' | 'monthly';

export const PRICES: Record<Plan, { label: string; price: string; sub: string }> = {
  annual: { label: 'Annual', price: '$59.99', sub: '14-day free trial, then $59.99 per year ($5.00 per month)' },
  monthly: { label: 'Monthly', price: '$9.99', sub: '$9.99 per month, no trial' },
};

export interface PurchaseResult {
  ok: boolean;
  reason?: string;
}

/**
 * RevenueCat wiring lands before the first TestFlight build:
 *   1. npx expo install react-native-purchases
 *   2. set EXPO_PUBLIC_REVENUECAT_IOS_KEY in every EAS environment (eas env:list production)
 *   3. configure lazily, inside these functions, never at module scope (Lessons Learned 6.2)
 * Until then both calls report "not configured" so the paywall never shows a dead button.
 */
export async function purchase(plan: Plan): Promise<PurchaseResult> {
  if (!REVENUECAT_IOS_KEY) return { ok: false, reason: 'Purchases are not configured in this build.' };
  return { ok: false, reason: `RevenueCat not wired yet (${plan}).` };
}

export async function restore(): Promise<PurchaseResult> {
  if (!REVENUECAT_IOS_KEY) return { ok: false, reason: 'Purchases are not configured in this build.' };
  return { ok: false, reason: 'RevenueCat not wired yet.' };
}
