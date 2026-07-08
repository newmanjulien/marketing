const monthIndexes = new Map(
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
    (month, index) => [month, index]
  )
);

const taskDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric'
});

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
