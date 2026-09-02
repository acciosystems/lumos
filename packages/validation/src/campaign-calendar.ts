import { CampaignStatus } from './campaign';

export const CAMPAIGN_TIME_ZONE = 'America/Sao_Paulo';

export type CampaignLifecycleState = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

type CampaignLifecycleDates = {
  status: CampaignStatus;
  startDate: Date | string;
  endDate: Date | string;
};

/** Returns the São Paulo calendar date for an instant as YYYY-MM-DD. */
export function getSaoPauloCalendarDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CAMPAIGN_TIME_ZONE,
    calendar: 'iso8601',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const values: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== 'literal') values[part.type] = part.value;
  }
  return `${values.year}-${values.month}-${values.day}`;
}

/** Converts a persisted DATE value into its stable YYYY-MM-DD representation. */
export function toCampaignCalendarDate(value: Date | string): string {
  return typeof value === 'string' ? value.slice(0, 10) : value.toISOString().slice(0, 10);
}

/** Adds calendar days without crossing a browser-local timezone boundary. */
export function addCampaignCalendarDays(calendarDate: string, days: number): string {
  const [year, month, day] = calendarDate.split('-').map(Number) as [number, number, number];
  const result = new Date(Date.UTC(year, month - 1, day + days));
  return [
    result.getUTCFullYear(),
    String(result.getUTCMonth() + 1).padStart(2, '0'),
    String(result.getUTCDate()).padStart(2, '0'),
  ].join('-');
}

/** Converts a São Paulo wall-clock time on a campaign calendar date into a UTC instant. */
export function getSaoPauloCalendarInstant(
  calendarDate: string,
  { hour = 0, minute = 0, second = 0 }: { hour?: number; minute?: number; second?: number } = {},
): Date {
  const [year, month, day] = calendarDate.split('-').map(Number) as [number, number, number];
  const wallClock = Date.UTC(year, month - 1, day, hour, minute, second);
  const firstCandidate = new Date(wallClock - getTimeZoneOffset(new Date(wallClock)));
  return new Date(wallClock - getTimeZoneOffset(firstCandidate));
}

/** Returns the UTC instant corresponding to São Paulo midnight on a calendar date. */
export function getSaoPauloMidnight(calendarDate: string): Date {
  return getSaoPauloCalendarInstant(calendarDate);
}

export function getAutomaticCompletionAt(endDate: Date | string): Date {
  return getSaoPauloMidnight(addCampaignCalendarDays(toCampaignCalendarDate(endDate), 1));
}

export function getEffectiveCampaignStatus({
  status,
  startDate,
  endDate,
  now = new Date(),
}: CampaignLifecycleDates & { now?: Date }): CampaignLifecycleState {
  if (status === CampaignStatus.CANCELLED || status === CampaignStatus.COMPLETED) return status;

  const today = getSaoPauloCalendarDate(now);
  const start = toCampaignCalendarDate(startDate);
  const end = toCampaignCalendarDate(endDate);
  if (today < start) return CampaignStatus.PENDING;
  if (today > end) return CampaignStatus.COMPLETED;
  return CampaignStatus.ACTIVE;
}

function getTimeZoneOffset(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CAMPAIGN_TIME_ZONE,
    calendar: 'iso8601',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);
  const values: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== 'literal') values[part.type] = part.value;
  }

  const localAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );

  return localAsUtc - date.getTime();
}
