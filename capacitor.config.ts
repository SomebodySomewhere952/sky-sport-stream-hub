import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.dce57cb3aac540fc83caa1b1a4e2381e',
  appName: 'Sky Sports FireTV',
  webDir: 'dist',
  server: {
    url: 'https://dce57cb3-aac5-40fc-83ca-a1b1a4e2381e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;