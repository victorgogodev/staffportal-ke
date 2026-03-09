import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday
} from 'date-fns';

/**
 * "March 8, 2026"
 */
export const formatFullDate = (date) =>
  format(new Date(date), 'MMMM d, yyyy');

/**
 * "08 Mar 2026"
 */
export const formatShortDate = (date) =>
  format(new Date(date), 'dd MMM yyyy');

/**
 * "Mar 2026" - used on payslip cards
 */
export const formatMonthYear = (date) =>
  format(new Date(date), 'MMM yyyy');

/**
 * "2 hours ago" / "Today" / "Yesterday" / "5 days ago"
 */
export const formatRelative = (date) => {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * "08 Mar 2026 - 15 Mar 2026" - used on leave cards
 */
export const formatDateRange = (start, end) =>
  `${formatShortDate(start)} - ${formatShortDate(end)}`;