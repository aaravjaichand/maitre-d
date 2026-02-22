import { promptSelect } from '../../../ui/prompts.js';

interface CalendarResult {
  calendar: {
    provider?: string;
    calendarId: string;
    checkConflicts: boolean;
    createEvents: boolean;
  };
}

const CALENDAR_OPTIONS = [
  { value: 'google', label: 'Google Calendar' },
  { value: 'apple', label: 'Apple Calendar' },
  { value: 'outlook', label: 'Outlook' },
  { value: 'caldav', label: 'CalDAV' },
  { value: 'skip', label: 'Skip for now' },
] as const;

export async function runCalendarStep(): Promise<CalendarResult> {
  const provider = await promptSelect<string>({
    message: 'Which calendar provider would you like to connect?',
    options: [...CALENDAR_OPTIONS],
  });

  if (provider === 'skip') {
    return {
      calendar: {
        calendarId: 'primary',
        checkConflicts: true,
        createEvents: true,
      },
    };
  }

  return {
    calendar: {
      provider,
      calendarId: 'primary',
      checkConflicts: true,
      createEvents: true,
    },
  };
}
