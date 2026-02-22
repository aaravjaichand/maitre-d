/** Connection configuration for a calendar provider (OAuth tokens, credentials, etc.) */
export type CalendarConnectionConfig = Record<string, unknown>;

/** A calendar event retrieved from a provider */
export interface CalendarEvent {
  /** Internal UUID */
  id: string;
  /** Calendar provider identifier (e.g., 'google', 'apple', 'outlook', 'caldav') */
  providerId: string;
  /** Provider's own event ID */
  externalId: string;
  /** Event title */
  title: string;
  /** Event start time */
  startTime: Date;
  /** Event end time */
  endTime: Date;
  /** Event location */
  location?: string;
  /** Event description */
  description?: string;
}

/** Data for creating a new calendar event */
export interface NewCalendarEvent {
  /** Event title */
  title: string;
  /** Event start time */
  startTime: Date;
  /** Event end time */
  endTime: Date;
  /** Event location */
  location?: string;
  /** Event description */
  description?: string;
  /** Reminder notifications before the event */
  reminders?: { /** Minutes before the event to trigger the reminder */ minutes: number }[];
}

/** A window of free time on the user's calendar */
export interface TimeWindow {
  /** Window start time */
  start: Date;
  /** Window end time */
  end: Date;
}

/** Common interface for all calendar provider adapters */
export interface CalendarAdapter {
  /** Unique provider identifier (e.g., 'google', 'apple', 'outlook', 'caldav') */
  readonly id: string;
  /** Human-readable provider name */
  readonly name: string;

  /** Check if the user has connected this calendar */
  isConnected(): Promise<boolean>;
  /** Initiate connection with the calendar provider */
  connect(config: CalendarConnectionConfig): Promise<boolean>;
  /** Disconnect and revoke tokens */
  disconnect(): Promise<void>;
  /** Get events that overlap with the given time range (for conflict checking) */
  getConflicts(start: Date, end: Date): Promise<CalendarEvent[]>;
  /** Get free windows within a date range */
  getFreeWindows(start: Date, end: Date, minDurationMinutes?: number): Promise<TimeWindow[]>;
  /** Create a calendar event for a confirmed booking */
  createEvent(event: NewCalendarEvent): Promise<CalendarEvent>;
  /** Update an existing calendar event */
  updateEvent(eventId: string, updates: Partial<NewCalendarEvent>): Promise<CalendarEvent>;
  /** Delete a calendar event (e.g., when reservation is cancelled) */
  deleteEvent(eventId: string): Promise<void>;
}
