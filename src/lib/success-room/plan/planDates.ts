const monthIndexes = new Map(
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
    (month, index) => [month, index]
  )
);

const taskDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric'
});

export const parseIsoDate = (value: string) => {
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
  const [monthLabel, dayLabel] = dateLabel.trim().split(/\s+/);
  const monthIndex = monthIndexes.get(monthLabel);
  const day = Number(dayLabel);
  const currentYear = new Date().getFullYear();

  if (monthIndex === undefined || !Number.isInteger(day)) {
    throw new Error(`Invalid task date label: ${dateLabel}`);
  }

  const date = new Date(currentYear, monthIndex, day);

  if (
    date.getFullYear() !== currentYear ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== day
  ) {
    throw new Error(`Invalid task date label: ${dateLabel}`);
  }

  return date;
};

export const formatTaskDateLabel = (date: Date) => taskDateFormatter.format(date);

export const resolveTaskDisplayDate = ({
  dateOverrides,
  taskId,
  fallbackDateLabel
}: {
  dateOverrides: Record<string, string>;
  taskId: string;
  fallbackDateLabel: string;
}) => {
  const overrideDate = dateOverrides[taskId];

  return overrideDate ? parseIsoDate(overrideDate) : parseTaskDateLabel(fallbackDateLabel);
};
