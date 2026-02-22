import pino from 'pino';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type {
  PlatformAdapter,
  CalendarAdapter,
  LLMProvider,
  NotificationChannel,
  NotificationResult,
  Restaurant,
  TimeSlot,
  BookingResult,
  CancelResult,
  Reservation,
  DropSchedule,
  CalendarEvent,
  NewCalendarEvent,
  TimeWindow,
  CompletionRequest,
  CompletionResponse,
  NotificationMessage,
  PlatformCredentials,
  RestaurantSearchQuery,
  AvailabilityQuery,
  CalendarConnectionConfig,
} from '../../src/types/index.js';

/** Create a silent pino logger for tests. */
export function createTestLogger(): pino.Logger {
  return pino({ level: 'silent' });
}

/** Create a temporary directory for file-based tests. */
export function createTempDir(): string {
  return mkdtempSync(join(tmpdir(), 'maitre-d-test-'));
}

/** Create a mock PlatformAdapter with all methods stubbed. */
export function createMockPlatformAdapter(
  overrides: Partial<PlatformAdapter> = {},
): PlatformAdapter {
  return {
    id: 'mock-platform',
    name: 'Mock Platform',
    isAuthenticated: async () => false,
    authenticate: async (_credentials: PlatformCredentials) => true,
    refreshAuth: async () => {},
    searchRestaurants: async (_query: RestaurantSearchQuery) => [] as Restaurant[],
    getRestaurant: async (_id: string) => null,
    getAvailability: async (_params: AvailabilityQuery) => [] as TimeSlot[],
    book: async (slot: TimeSlot) => ({
      status: 'confirmed' as const,
      confirmationId: 'mock-123',
      slot,
    }),
    cancelReservation: async (_id: string) => ({ status: 'cancelled' as const }) as CancelResult,
    getReservations: async () => [] as Reservation[],
    getDropSchedule: async (_id: string) => null as DropSchedule | null,
    ...overrides,
  };
}

/** Create a mock CalendarAdapter with all methods stubbed. */
export function createMockCalendarAdapter(
  overrides: Partial<CalendarAdapter> = {},
): CalendarAdapter {
  return {
    id: 'mock-calendar',
    name: 'Mock Calendar',
    isConnected: async () => false,
    connect: async (_config: CalendarConnectionConfig) => true,
    disconnect: async () => {},
    getConflicts: async (_start: Date, _end: Date) => [] as CalendarEvent[],
    getFreeWindows: async (_start: Date, _end: Date, _min?: number) => [] as TimeWindow[],
    createEvent: async (event: NewCalendarEvent) => ({
      id: 'mock-event-1',
      providerId: 'mock-calendar',
      externalId: 'ext-1',
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      description: event.description,
    }),
    updateEvent: async (_id: string, _updates: Partial<NewCalendarEvent>) => ({
      id: 'mock-event-1',
      providerId: 'mock-calendar',
      externalId: 'ext-1',
      title: 'Updated',
      startTime: new Date(),
      endTime: new Date(),
    }),
    deleteEvent: async (_id: string) => {},
    ...overrides,
  };
}

/** Create a mock LLMProvider with all methods stubbed. */
export function createMockLLMProvider(overrides: Partial<LLMProvider> = {}): LLMProvider {
  return {
    id: 'mock-llm',
    name: 'Mock LLM',
    isAvailable: async () => true,
    complete: async (_request: CompletionRequest) =>
      ({
        content: 'mock response',
        usage: { inputTokens: 10, outputTokens: 20 },
        finishReason: 'stop' as const,
      }) as CompletionResponse,
    stream: async function* (_request: CompletionRequest) {
      yield 'mock ';
      yield 'stream';
    },
    ...overrides,
  };
}

/** Create a mock NotificationChannel with all methods stubbed. */
export function createMockNotificationChannel(
  overrides: Partial<NotificationChannel> & { id?: string; name?: string; enabled?: boolean } = {},
): NotificationChannel {
  const enabled = overrides.enabled ?? true;
  return {
    id: overrides.id ?? 'mock-channel',
    name: overrides.name ?? 'Mock Channel',
    isEnabled: () => enabled,
    send: async (_message: NotificationMessage) => ({ success: true }) as NotificationResult,
    ...overrides,
  };
}
