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
] as const;
const monthIndexes: ReadonlyMap<string, number> = new Map(
  monthLabels.map((month, index) => [month, index])
);
const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
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
  const match = isoDatePattern.exec(value);

  if (!match) {
    throw new Error(`Invalid ISO date: ${value}`);
  }

  return createCalendarDate({
    year: Number(match[1]),
    monthIndex: Number(match[2]) - 1,
    day: Number(match[3]),
    invalidMessage: `Invalid ISO date: ${value}`
  });
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
  const monthIndex = monthIndexes.get(monthLabel);
  const day = Number(dayLabel);
  const currentYear = new Date().getFullYear();

  if (monthIndex === undefined || !Number.isInteger(day)) {
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
  fallbackDateLabel: string;
}) => {
  const overrideDate = dateOverridesByTaskKey[taskKey];

  return overrideDate ? parseIsoDate(overrideDate) : parseTaskDateLabel(fallbackDateLabel);
};
