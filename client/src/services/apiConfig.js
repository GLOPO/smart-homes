// Detects if the app is running on localhost or on Vercel
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

// Set the base URL: Use Render URL for production, localhost for development
export const API_BASE_URL = isLocalhost 
  ? 'http://localhost:3000' 
  : 'https://smart-homes-server.onrender.com';