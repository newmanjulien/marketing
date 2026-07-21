import { isValidPlanTaskDate } from '../../../../shared/successRoomPlan';

const taskDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric'
});

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

export const formatTaskDateLabel = (date: Date) => taskDateFormatter.format(date);

export const resolveTaskDisplayDate = (
  dateOverridesByTaskKey: Record<string, string>,
  taskKey: string
): Date | null => {
  const overrideDate = dateOverridesByTaskKey[taskKey];

  return overrideDate ? parseIsoDate(overrideDate) : null;
};
