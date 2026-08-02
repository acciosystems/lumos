import { format, type FormatOptions } from 'date-fns';

/** Formats a campaign's calendar date without converting it to the browser's timezone. */
export function formatCampaignDate(
  value: Date | string,
  formatString: string,
  options?: FormatOptions,
) {
  const date = new Date(value);
  const calendarDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

  return format(calendarDate, formatString, options);
}
