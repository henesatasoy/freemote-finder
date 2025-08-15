import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b2c4894d4e2a4a149d4edf39d3a461d7',
  appName: 'freemote-finder',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: "https://b2c4894d-4e2a-4a14-9d4e-df39d3a461d7.lovableproject.com?forceHideBadge=true",
    cleartext: true
  }
};

export default config;