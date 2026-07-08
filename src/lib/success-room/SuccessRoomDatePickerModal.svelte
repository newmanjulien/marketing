<script lang="ts">
  import { CaretLeftIcon, CaretRightIcon } from 'phosphor-svelte';
  import ModalShell from '$lib/ui/ModalShell.svelte';

  type CalendarDay = {
    date: Date;
    day: number;
    key: string;
    isCurrentMonth: boolean;
    isSelected: boolean;
  };

  let {
    open,
    selectedDate,
    onSelectDate,
    onClose
  }: {
    open: boolean;
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    onClose: () => void;
  } = $props();

  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
  const monthLabelFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const calendarHeaderClasses = 'mb-[18px] flex items-center justify-between gap-[12px]';
  const monthButtonClasses =
    'flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-stone-200/80 bg-white p-0 text-stone-500 transition-colors duration-150 hover:bg-stone-50 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20';
  const monthLabelClasses =
    'min-w-0 text-center text-[14px] font-normal leading-none tracking-normal text-stone-950';
  const weekdayGridClasses = 'grid grid-cols-7 gap-[4px]';
  const weekdayLabelClasses =
    'flex h-[24px] items-center justify-center text-[11px] font-book leading-none tracking-normal text-stone-400';
  const dayGridClasses = 'mt-[6px] grid grid-cols-7 gap-[4px]';
  const dayButtonBaseClasses =
    'flex aspect-square min-h-[34px] items-center justify-center rounded-[6px] border-0 p-0 font-body text-[13px] font-book leading-none tracking-normal transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20';

  const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

  const isSameDay = (left: Date, right: Date) =>
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate();

  const getDateKey = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  let visibleMonth = $state(startOfMonth(new Date()));

  $effect(() => {
    if (open) {
      visibleMonth = startOfMonth(selectedDate);
    }
  });

  const calendarDays = $derived.by<CalendarDay[]>(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDayOfWeek = visibleMonth.getDay();
    const gridStartDate = new Date(year, month, 1 - firstDayOfWeek);

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(
        gridStartDate.getFullYear(),
        gridStartDate.getMonth(),
        gridStartDate.getDate() + index
      );

      return {
        date,
        day: date.getDate(),
        key: getDateKey(date),
        isCurrentMonth: date.getMonth() === month,
        isSelected: isSameDay(date, selectedDate)
      };
    });
  });

  const shiftVisibleMonth = (offset: number) => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1);
  };

  const selectDate = (date: Date) => {
    onSelectDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
    onClose();
  };
</script>

<ModalShell {open} title="Select date" onClose={onClose} class="max-w-[360px]">
  <div class="font-body">
    <div class={calendarHeaderClasses}>
      <button
        type="button"
        class={monthButtonClasses}
        aria-label="Previous month"
        onclick={() => shiftVisibleMonth(-1)}
      >
        <CaretLeftIcon size={15} weight="bold" aria-hidden="true" />
      </button>

      <div class={monthLabelClasses} aria-live="polite">
        {monthLabelFormatter.format(visibleMonth)}
      </div>

      <button
        type="button"
        class={monthButtonClasses}
        aria-label="Next month"
        onclick={() => shiftVisibleMonth(1)}
      >
        <CaretRightIcon size={15} weight="bold" aria-hidden="true" />
      </button>
    </div>

    <div class={weekdayGridClasses} aria-hidden="true">
      {#each weekdayLabels as weekday}
        <div class={weekdayLabelClasses}>{weekday}</div>
      {/each}
    </div>

    <div class={dayGridClasses}>
      {#each calendarDays as calendarDay (calendarDay.key)}
        <button
          type="button"
          class={[
            dayButtonBaseClasses,
            calendarDay.isSelected
              ? 'bg-stone-900 text-white hover:bg-stone-800'
              : calendarDay.isCurrentMonth
                ? 'bg-transparent text-stone-800 hover:bg-stone-100'
                : 'bg-transparent text-stone-300 hover:bg-stone-50 hover:text-stone-500'
          ]}
          aria-label={calendarDay.date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
          aria-pressed={calendarDay.isSelected}
          onclick={() => selectDate(calendarDay.date)}
        >
          {calendarDay.day}
        </button>
      {/each}
    </div>
  </div>
</ModalShell>
