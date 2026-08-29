import { CampaignStatus } from '@lumos/validation/campaign';

type CampaignStatusMetadata = {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
};

export const campaignStatusMetadata = {
  [CampaignStatus.PENDING]: { label: 'Pendente', variant: 'secondary' },
  [CampaignStatus.ACTIVE]: { label: 'Ativa', variant: 'default' },
  [CampaignStatus.COMPLETED]: { label: 'Concluída', variant: 'outline' },
  [CampaignStatus.CANCELLED]: { label: 'Cancelada', variant: 'destructive' },
} satisfies Record<CampaignStatus, CampaignStatusMetadata>;

const CAMPAIGN_TIME_ZONE = 'America/Sao_Paulo';

type CampaignLifecycleDates = {
  status: CampaignStatus;
  startDate: Date | string;
  endDate: Date | string;
};

/**
 * Derives the status a donor should see from the campaign calendar dates.
 * The server remains authoritative for mutations; this keeps an already-open
 * page from showing payment details after a date boundary has passed.
 */
export function getCampaignEffectiveStatus({
  status,
  startDate,
  endDate,
  now = new Date(),
}: CampaignLifecycleDates & { now?: Date }): CampaignStatus {
  if (status === CampaignStatus.CANCELLED || status === CampaignStatus.COMPLETED) return status;

  const today = getSaoPauloCalendarDate(now);
  const start = toCampaignCalendarDate(startDate);
  const end = toCampaignCalendarDate(endDate);
  if (today < start) return CampaignStatus.PENDING;
  if (today > end) return CampaignStatus.COMPLETED;
  return CampaignStatus.ACTIVE;
}

/** Returns the next São Paulo midnight at which a non-terminal status can change. */
export function getNextCampaignLifecycleCheckAt({
  status,
  startDate,
  endDate,
}: CampaignLifecycleDates): Date | null {
  if (status === CampaignStatus.PENDING) {
    return getSaoPauloMidnight(toCampaignCalendarDate(startDate));
  }

  if (status === CampaignStatus.ACTIVE) {
    const end = toCampaignCalendarDate(endDate);
    return getSaoPauloMidnight(addCalendarDays(end, 1));
  }

  return null;
}

/** Delay until the next campaign calendar day begins in São Paulo. */
export function getMillisecondsUntilNextCampaignDay(now = new Date()) {
  const nextDay = addCalendarDays(getSaoPauloCalendarDate(now), 1);
  return Math.max(100, getSaoPauloMidnight(nextDay).getTime() - now.getTime() + 50);
}

function getSaoPauloCalendarDate(now: Date) {
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

function toCampaignCalendarDate(value: Date | string) {
  return typeof value === 'string' ? value.slice(0, 10) : value.toISOString().slice(0, 10);
}

function addCalendarDays(calendarDate: string, days: number) {
  const [year, month, day] = calendarDate.split('-').map(Number) as [number, number, number];
  const result = new Date(Date.UTC(year, month - 1, day + days));
  return [
    result.getUTCFullYear(),
    String(result.getUTCMonth() + 1).padStart(2, '0'),
    String(result.getUTCDate()).padStart(2, '0'),
  ].join('-');
}

function getSaoPauloMidnight(calendarDate: string) {
  const [year, month, day] = calendarDate.split('-').map(Number) as [number, number, number];
  const wallClock = Date.UTC(year, month - 1, day);
  const firstCandidate = new Date(wallClock - getTimeZoneOffset(new Date(wallClock)));
  return new Date(wallClock - getTimeZoneOffset(firstCandidate));
}

function getTimeZoneOffset(date: Date) {
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
