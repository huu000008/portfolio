'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'rounded-xl border shadow-lg p-6',
        'bg-[var(--color-card)] text-[var(--color-foreground)]',
        className,
      )}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-4',
        month: 'bg-[var(--color-card)] rounded-lg p-4 shadow',
        caption: 'flex justify-between items-center mb-4',
        caption_label: 'text-lg font-bold text-[var(--color-primary)]',
        nav: 'flex items-center gap-2',
        nav_button:
          'text-[var(--color-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] rounded-full transition-colors',
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full',
        head_row: 'flex',
        head_cell:
          'w-10 h-10 text-center text-xs font-semibold text-[var(--color-muted-foreground)]',
        row: 'flex w-full',
        cell: 'w-10 h-10 p-0 text-center',
        day: 'w-10 h-10 rounded-full transition-colors duration-200 hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]',
        day_selected:
          'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-foreground)] shadow-md',
        day_today: 'border-2 border-[var(--color-primary)]',
        day_outside: 'text-[var(--color-muted)]',
        day_disabled: 'text-[var(--color-muted)] line-through opacity-50',
        day_range_start: 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]',
        day_range_end: 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]',
        day_range_middle: 'bg-[var(--color-accent)]/50 text-[var(--color-accent-foreground)]',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn('h-4 w-4', className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn('h-4 w-4', className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
