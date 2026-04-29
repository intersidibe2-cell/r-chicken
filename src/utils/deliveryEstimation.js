// Smart delivery estimation for Bamako
// Considers: distance zones, peak hours, kitchen load, weather

// Bamako delivery zones with estimated times (in minutes)
const DELIVERY_ZONES = {
  // Central zones - fastest delivery
  'baco-djicoroni': { baseTime: 12, name: 'Baco-djicoroni' },
  'hippodrome': { baseTime: 15, name: 'Hippodrome' },
  'quartier': { baseTime: 15, name: 'Le Quartier' },
  'banankabougou': { baseTime: 15, name: 'Banankabougou' },
  'niamakoro': { baseTime: 18, name: 'Niamakoro' },
  
  // Medium distance zones
  'badalabougou': { baseTime: 18, name: 'Badalabougou' },
  'dialloubé': { baseTime: 18, name: 'Dialloubé' },
  'sébénikoro': { baseTime: 18, name: 'Sébénikoro' },
  'kalabancoro': { baseTime: 20, name: 'Kalabancoro' },
  'lafiabougou': { baseTime: 18, name: 'Lafiabougou' },
  
  // Farther zones
  'sotuba': { baseTime: 25, name: 'Sotuba' },
  'kati': { baseTime: 35, name: 'Kati' },
  'default': { baseTime: 20, name: 'Zone éloignée' }
};

// Peak hours in Bamako (affects delivery time)
const PEAK_HOURS = [
  { start: 12, end: 14, multiplier: 1.3, label: 'Déjeuner' },
  { start: 18, end: 21, multiplier: 1.4, label: 'Dîner' },
  { start: 21, end: 23, multiplier: 1.2, label: 'Soirée' }
];

// Kitchen load simulation based on time
const getKitchenLoad = () => {
  const hour = new Date().getHours();
  const day = new Date().getDay(); // 0 = Sunday
  
  // Weekend is busier
  let load = day === 0 || day === 6 ? 1.2 : 1.0;
  
  // Peak hours
  if (hour >= 12 && hour <= 14) load *= 1.3;
  if (hour >= 18 && hour <= 21) load *= 1.4;
  
  return load;
};

// Get zone from address (simple keyword matching)
export const detectZone = (address) => {
  if (!address) return DELIVERY_ZONES.default;
  
  const addressLower = address.toLowerCase();
  
  for (const [key, zone] of Object.entries(DELIVERY_ZONES)) {
    if (key === 'default') continue;
    if (addressLower.includes(key) || addressLower.includes(zone.name.toLowerCase())) {
      return zone;
    }
  }
  
  // Check for common Bamako landmarks
  if (addressLower.includes('marché') || addressLower.includes('mosquée')) {
    return DELIVERY_ZONES['baco-djicoroni'];
  }
  
  return DELIVERY_ZONES.default;
};

// Calculate delivery time
export const calculateDeliveryTime = (address = null, itemCount = 1) => {
  const now = new Date();
  const hour = now.getHours();
  
  // Base time from zone
  const zone = detectZone(address);
  let baseTime = zone.baseTime;
  
  // Peak hours multiplier
  let peakMultiplier = 1.0;
  let peakLabel = null;
  
  for (const peak of PEAK_HOURS) {
    if (hour >= peak.start && hour < peak.end) {
      peakMultiplier = peak.multiplier;
      peakLabel = peak.label;
      break;
    }
  }
  
  // Kitchen load
  const kitchenLoad = getKitchenLoad();
  
  // Item preparation time (more items = slightly longer)
  const itemTime = Math.min(itemCount * 2, 15); // Max 15 min extra
  
  // Calculate total time
  let totalTime = Math.round(baseTime * peakMultiplier * kitchenLoad) + itemTime;
  
  // Ensure reasonable bounds
  totalTime = Math.max(20, Math.min(totalTime, 90));
  
  // Generate time range (±5 minutes)
  const minTime = Math.max(15, totalTime - 5);
  const maxTime = totalTime + 5;
  
  return {
    zone: zone.name,
    minTime,
    maxTime,
    peakLabel,
    isPeakHour: peakLabel !== null,
    formatted: `${minTime}-${maxTime} min`,
    note: peakLabel ? `⏰ Heure de pointe (${peakLabel})` : null
  };
};

// Get delivery fee based on zone
export const getDeliveryFee = (address = null, orderTotal = 0) => {
  // Pour le moment: livraison à discuter
  // Le livreur confirmera le montant exact
  return { 
    fee: null, 
    free: false, 
    reason: 'À discuter',
    message: 'Frais de livraison selon votre zone (500-2000 F)'
  };
};

// Format time for display
export const formatDeliveryTime = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h${mins > 0 ? mins : ''}`;
};

// Check if restaurant is open (24/7 for R-CHICKEN)
export const isRestaurantOpen = () => {
  return { open: true, message: 'Ouvert 24h/24, 7j/7' };
};

export default {
  calculateDeliveryTime,
  getDeliveryFee,
  detectZone,
  formatDeliveryTime,
  isRestaurantOpen,
  DELIVERY_ZONES
};
