<script lang="ts">
  import { CaretLeftIcon, CaretRightIcon } from 'phosphor-svelte';
  import ModalShell from '$lib/success-room/ui/ModalShell.svelte';
  import { formatIsoDate } from './planDates';

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
  const dayLabelFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const monthButtonClasses =
    'flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-stone-200/80 bg-white p-0 text-stone-500 transition-colors duration-150 hover:bg-stone-50 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20';

  const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

  // Writable derived: month navigation reassigns it, and reopening the modal
  // (or a new selectedDate) snaps it back to the selected month.
  let visibleMonth = $derived(startOfMonth(open ? selectedDate : new Date()));

  const calendarDays = $derived.by(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDayOfWeek = visibleMonth.getDay();
    const selectedDateKey = formatIsoDate(selectedDate);

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(year, month, 1 - firstDayOfWeek + index);
      const key = formatIsoDate(date);

      return {
        date,
        day: date.getDate(),
        key,
        label: dayLabelFormatter.format(date),
        isCurrentMonth: date.getMonth() === month,
        isSelected: key === selectedDateKey
      };
    });
  });

  const shiftVisibleMonth = (offset: number) => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1);
  };

  const selectDate = (date: Date) => {
    onSelectDate(date);
    onClose();
  };
</script>

<ModalShell {open} title="Select date" {onClose} maxWidth={360}>
  <div class="font-body">
    <div class="mb-[18px] flex items-center justify-between gap-[12px]">
      <button
        type="button"
        class={monthButtonClasses}
        aria-label="Previous month"
        onclick={() => shiftVisibleMonth(-1)}
      >
        <CaretLeftIcon size={15} weight="bold" aria-hidden="true" />
      </button>

      <div class="min-w-0 text-center text-[14px] font-normal leading-none text-stone-950" aria-live="polite">
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

    <div class="grid grid-cols-7 gap-[4px]" aria-hidden="true">
      {#each weekdayLabels as weekday}
        <div class="flex h-[24px] items-center justify-center text-[11px] font-book leading-none text-stone-400">{weekday}</div>
      {/each}
    </div>

    <div class="mt-[6px] grid grid-cols-7 gap-[4px]">
      {#each calendarDays as calendarDay (calendarDay.key)}
        <button
          type="button"
          class={[
            'flex aspect-square min-h-[34px] items-center justify-center rounded-[6px] border-0 p-0 font-body text-[13px] font-book leading-none transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900/20',
            calendarDay.isSelected
              ? 'bg-stone-900 text-white hover:bg-stone-800'
              : calendarDay.isCurrentMonth
                ? 'bg-transparent text-stone-800 hover:bg-stone-100'
                : 'bg-transparent text-stone-300 hover:bg-stone-50 hover:text-stone-500'
          ]}
          aria-label={calendarDay.label}
          aria-pressed={calendarDay.isSelected}
          onclick={() => selectDate(calendarDay.date)}
        >
          {calendarDay.day}
        </button>
      {/each}
    </div>
  </div>
</ModalShell>
