import type { SeatingType, TimeRange } from './reservation.js';

/** User taste profile built from explicit statements and implicit behavior */
export interface UserPreferences {
  /** Explicitly stated favorite cuisines */
  cuisines: string[];
  /** Implicit cuisine weights from booking/watching behavior */
  cuisineWeights: Record<string, number>;
  /** Explicitly stated favorite neighborhoods */
  neighborhoods: string[];
  /** Implicit neighborhood weights from booking/watching behavior */
  neighborhoodWeights: Record<string, number>;
  /** Preferred price level range (e.g., [2, 4] for $$ to $$$$) */
  priceRange?: [number, number];
  /** Implicit price level weights from booking/watching behavior */
  priceLevelWeights: Record<number, number>;
  /** Preferred seating types */
  seating: SeatingType[];
  /** Default party size for reservations */
  defaultPartySize: number;
  /** Default preferred time range */
  defaultTimePreference?: TimeRange;
  /** Preferred dining styles (e.g., 'casual', 'fine_dining', 'tasting_menu') */
  diningStyle: string[];
}
