// Lessons Learned 6.1 and 6.3: every EXPO_PUBLIC_* is read here, once, with a
// visible fallback. Never write process.env.X! anywhere in this codebase.
// EXPO_PUBLIC_* values are inlined into the JS bundle, so they are never secret.

function env(name: string, fallback: string): string {
  const v = process.env[name];
  if (!v) {
    if (__DEV__) console.warn(`[config] ${name} is not set, using fallback`);
    return fallback;
  }
  return v;
}

export const REVENUECAT_IOS_KEY = env('EXPO_PUBLIC_REVENUECAT_IOS_KEY', '');
export const PRIVACY_URL = env('EXPO_PUBLIC_PRIVACY_URL', 'https://fourcount.app/privacy');
export const TERMS_URL = env(
  'EXPO_PUBLIC_TERMS_URL',
  'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'
);
