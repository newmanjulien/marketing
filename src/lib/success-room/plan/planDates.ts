import { isValidPlanTaskDate } from '../../../../shared/successRoomPlan';

const monthLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];
const taskDateLabelPattern = /^([A-Z][a-z]{2})\s+(\d{1,2})$/;

const taskDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric'
});

const createCalendarDate = ({
  day,
  invalidMessage,
  monthIndex,
  year
}: {
  day: number;
  invalidMessage: string;
  monthIndex: number;
  year: number;
}) => {
  const date = new Date(year, monthIndex, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== day
  ) {
    throw new Error(invalidMessage);
  }

  return date;
};

export const parseIsoDate = (value: string) => {
  if (!isValidPlanTaskDate(value)) {
    throw new Error(`Invalid ISO date: ${value}`);
  }

  const [year, month, day] = value.split('-').map(Number);

  return new Date(year, month - 1, day);
};

export const formatIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const parseTaskDateLabel = (dateLabel: string) => {
  const match = taskDateLabelPattern.exec(dateLabel.trim());

  if (!match) {
    throw new Error(`Invalid task date label: ${dateLabel}`);
  }

  const [, monthLabel, dayLabel] = match;
  const monthIndex = monthLabels.indexOf(monthLabel);
  const day = Number(dayLabel);
  const currentYear = new Date().getFullYear();

  if (monthIndex === -1) {
    throw new Error(`Invalid task date label: ${dateLabel}`);
  }

  return createCalendarDate({
    year: currentYear,
    monthIndex,
    day,
    invalidMessage: `Invalid task date label: ${dateLabel}`
  });
};

export const formatTaskDateLabel = (date: Date) => taskDateFormatter.format(date);

export const resolveTaskDisplayDate = ({
  dateOverridesByTaskKey,
  taskKey,
  fallbackDateLabel
}: {
  dateOverridesByTaskKey: Record<string, string>;
  taskKey: string;
  fallbackDateLabel?: string;
}): Date | null => {
  const overrideDate = dateOverridesByTaskKey[taskKey];

  if (overrideDate) {
    return parseIsoDate(overrideDate);
  }

  return fallbackDateLabel ? parseTaskDateLabel(fallbackDateLabel) : null;
};
