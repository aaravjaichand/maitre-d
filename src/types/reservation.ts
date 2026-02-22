/** Seating type options across platforms */
export type SeatingType =
  | 'dining_room'
  | 'outdoor'
  | 'bar'
  | 'counter'
  | 'chefs_table'
  | 'private'
  | 'lounge'
  | 'unknown';

/** A time range specified in minutes from midnight */
export interface TimeRange {
  /** Minutes from midnight (e.g., 1140 = 7:00 PM) */
  startMinutes: number;
  /** Minutes from midnight */
  endMinutes: number;
}

/** A restaurant entity */
export interface Restaurant {
  /** Internal UUID */
  id: string;
  /** Platform identifier (e.g., 'resy', 'opentable') */
  platformId: string;
  /** Platform's own ID for this venue */
  platformRestaurantId: string;
  /** Restaurant name */
  name: string;
  /** Cuisine types */
  cuisine: string[];
  /** Neighborhood */
  neighborhood: string;
  /** City */
  city: string;
  /** State */
  state: string;
  /** Street address */
  address: string;
  /** Latitude */
  latitude: number;
  /** Longitude */
  longitude: number;
  /** Price level from 1 ($) to 4 ($$$$) */
  priceLevel: 1 | 2 | 3 | 4;
  /** Platform rating, if available */
  rating?: number;
  /** Image URL */
  imageUrl?: string;
  /** Platform URL for this restaurant */
  url: string;
  /** Platform-specific extra data */
  metadata: Record<string, unknown>;
}

/** An available time slot */
export interface TimeSlot {
  /** Composite ID: platformId + configId + time */
  id: string;
  /** Platform identifier */
  platformId: string;
  /** Restaurant ID */
  restaurantId: string;
  /** Restaurant name (denormalized for convenience) */
  restaurantName: string;
  /** Restaurant address (denormalized for convenience) */
  restaurantAddress: string;
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  /** Full datetime of the slot */
  time: Date;
  /** Party size this slot accommodates */
  partySize: number;
  /** Type of seating */
  seatingType: SeatingType;
  /** Platform-specific data needed for booking */
  platformData: Record<string, unknown>;
}

/** A confirmed reservation */
export interface Reservation {
  /** Internal UUID */
  id: string;
  /** Platform identifier */
  platformId: string;
  /** Platform's confirmation/reservation ID */
  platformReservationId: string;
  /** Restaurant ID */
  restaurantId: string;
  /** Restaurant name */
  restaurantName: string;
  /** ISO date string */
  date: string;
  /** Reservation time */
  time: Date;
  /** Party size */
  partySize: number;
  /** Seating type */
  seatingType: SeatingType;
  /** Reservation status */
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  /** Confirmation ID from platform */
  confirmationId: string;
  /** URL to manage the reservation */
  manageUrl?: string;
  /** Linked calendar event ID, if created */
  calendarEventId?: string;
  /** When this reservation was booked */
  bookedAt: Date;
  /** How this reservation was booked */
  bookedBy: 'snipe' | 'watch' | 'manual';
}

/** Result of a booking attempt */
export interface BookingResult {
  /** Outcome status */
  status: 'confirmed' | 'unavailable' | 'failed';
  /** Confirmation ID (when confirmed) */
  confirmationId?: string;
  /** URL to manage the reservation */
  manageUrl?: string;
  /** Error message (when failed) */
  error?: string;
  /** The slot that was booked */
  slot: TimeSlot;
}

/** Result of a cancellation attempt */
export interface CancelResult {
  /** Outcome status */
  status: 'cancelled' | 'failed';
  /** Error message (when failed) */
  error?: string;
}

/** Status of a snipe operation */
export type SnipeStatus = 'pending' | 'armed' | 'fired' | 'booked' | 'failed' | 'cancelled';

/** Status of a watch operation */
export type WatchStatus = 'active' | 'paused' | 'completed' | 'cancelled';

/** A scheduled drop snipe */
export interface Snipe {
  /** Internal UUID */
  id: string;
  /** Target restaurant ID */
  restaurantId: string;
  /** Restaurant name */
  restaurantName: string;
  /** Platform identifier */
  platformId: string;
  /** Target reservation date (ISO date) */
  date: string;
  /** Party size */
  partySize: number;
  /** When reservations drop (the snipe fire time) */
  dropTime: Date;
  /** Preferred time ranges */
  preferredTimes?: TimeRange[];
  /** Acceptable (fallback) time ranges */
  acceptableTimes?: TimeRange[];
  /** Preferred seating types */
  seatingPreferences?: SeatingType[];
  /** Current snipe status */
  status: SnipeStatus;
  /** Linked reservation ID if booking succeeded */
  resultReservationId?: string;
  /** When this snipe was created */
  createdAt: Date;
}

/** A cancellation monitoring watch */
export interface Watch {
  /** Internal UUID */
  id: string;
  /** Target restaurant ID */
  restaurantId: string;
  /** Restaurant name */
  restaurantName: string;
  /** Platform identifier */
  platformId: string;
  /** Target reservation date (ISO date) */
  date: string;
  /** Optional date range for flexible watching */
  dateRange?: { start: string; end: string };
  /** Party size */
  partySize: number;
  /** Preferred time ranges */
  preferredTimes?: TimeRange[];
  /** Acceptable (fallback) time ranges */
  acceptableTimes?: TimeRange[];
  /** Preferred seating types */
  seatingPreferences?: SeatingType[];
  /** Watch mode: auto-book or notify only */
  mode: 'auto_book' | 'notify';
  /** Polling interval in milliseconds */
  pollIntervalMs?: number;
  /** Current watch status */
  status: WatchStatus;
  /** Linked reservation ID if booking succeeded */
  resultReservationId?: string;
  /** When this watch was created */
  createdAt: Date;
}

/** Restaurant drop schedule information */
export interface DropSchedule {
  /** When reservations drop (e.g., "daily at 09:00") */
  pattern: string;
  /** How many days ahead the drop opens */
  daysAhead: number;
  /** Last known drop time (for validation) */
  lastKnownDrop?: Date;
  /** Source of this information */
  source: 'platform' | 'crowdsourced' | 'user';
}
