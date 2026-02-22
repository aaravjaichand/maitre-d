import type {
  Restaurant,
  TimeSlot,
  BookingResult,
  CancelResult,
  Reservation,
  DropSchedule,
} from './reservation.js';

/** Credentials for authenticating with a reservation platform */
export interface PlatformCredentials {
  /** Platform identifier (e.g., 'resy', 'opentable') */
  platformId: string;
  /** Auth type determines which credential fields are used */
  authType: 'password' | 'token' | 'oauth' | 'session';
  /** Account email address */
  email?: string;
  /** Account password (only held in memory during auth, never persisted raw) */
  password?: string;
  /** Authentication token */
  authToken?: string;
  /** Refresh token for token rotation */
  refreshToken?: string;
  /** Session cookie value */
  sessionCookie?: string;
  /** When the current credentials expire */
  expiresAt?: Date;
  /** Platform-specific fields (API key, etc.) */
  metadata?: Record<string, string>;
}

/** Query parameters for searching restaurants */
export interface RestaurantSearchQuery {
  /** Free-text search */
  text?: string;
  /** Geographic location filter */
  location?: {
    /** Latitude */
    latitude: number;
    /** Longitude */
    longitude: number;
    /** Search radius in miles */
    radiusMiles?: number;
  };
  /** Filter by cuisine types */
  cuisine?: string[];
  /** Filter by price level range (e.g., [2, 4] for $$ to $$$$) */
  priceRange?: [number, number];
  /** Filter by availability on this date (ISO date string) */
  date?: string;
  /** Filter by party size */
  partySize?: number;
  /** Maximum number of results to return */
  limit?: number;
}

/** Query parameters for checking availability at a specific restaurant */
export interface AvailabilityQuery {
  /** Restaurant ID on the platform */
  restaurantId: string;
  /** Target date (ISO date string) */
  date: string;
  /** Party size */
  partySize: number;
}

/** Common interface for all reservation platform adapters */
export interface PlatformAdapter {
  /** Unique platform identifier (e.g., 'resy', 'opentable') */
  readonly id: string;
  /** Human-readable platform name */
  readonly name: string;

  /** Check if the user has valid credentials for this platform */
  isAuthenticated(): Promise<boolean>;
  /** Authenticate the user with the provided credentials */
  authenticate(credentials: PlatformCredentials): Promise<boolean>;
  /** Refresh authentication if token-based */
  refreshAuth(): Promise<void>;
  /** Search for restaurants by query string or structured criteria */
  searchRestaurants(query: RestaurantSearchQuery): Promise<Restaurant[]>;
  /** Get a specific restaurant by its platform-specific ID */
  getRestaurant(restaurantId: string): Promise<Restaurant | null>;
  /** Get available time slots for a specific restaurant, date, and party size */
  getAvailability(params: AvailabilityQuery): Promise<TimeSlot[]>;
  /** Book a specific time slot */
  book(slot: TimeSlot): Promise<BookingResult>;
  /** Cancel an existing reservation */
  cancelReservation(reservationId: string): Promise<CancelResult>;
  /** Get the user's existing reservations on this platform */
  getReservations(): Promise<Reservation[]>;
  /** Get known drop schedule info for a restaurant (if available) */
  getDropSchedule(restaurantId: string): Promise<DropSchedule | null>;
}
