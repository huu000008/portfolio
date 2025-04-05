'use client';

import { useState, useMemo } from 'react';
import { useFormContext, useController } from 'react-hook-form';
import { format, parseISO, isValid } from 'date-fns';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './DatePicker.module.scss';

interface DatePickerProps {
  name: string;
  onBlur?: () => void;
}

export const DatePicker = ({ name, onBlur }: DatePickerProps) => {
  const { control, setValue, trigger } = useFormContext();

  const {
    field: { value },
  } = useController({ name, control });

  const initialRange = useMemo((): DateRange | undefined => {
    if (typeof value === 'string' && value.includes('~')) {
      const [fromStr, toStr] = value.split('~').map(v => v.trim());
      const from = parseISO(fromStr);
      const to = parseISO(toStr);
      return isValid(from) && isValid(to) ? { from, to } : undefined;
    }
    return undefined;
  }, [value]);

  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(initialRange);
  const [tempRange, setTempRange] = useState<DateRange | undefined>(initialRange);
  const [showCalendar, setShowCalendar] = useState(false);

  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

  const triggerLabel =
    selectedRange?.from && selectedRange?.to
      ? `${formatDate(selectedRange.from)} ~ ${formatDate(selectedRange.to)}`
      : '날짜 범위를 선택하세요';

  const handleConfirm = async () => {
    if (tempRange?.from && tempRange?.to) {
      const newValue = `${tempRange.from.toISOString()} ~ ${tempRange.to.toISOString()}`;
      setSelectedRange(tempRange);
      setValue(name, newValue);
    } else {
      setSelectedRange(undefined);
      setValue(name, '');
    }

    await trigger(name);
    setShowCalendar(false);
    onBlur?.();
  };

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.trigger} onClick={() => setShowCalendar(true)}>
        {triggerLabel}
      </button>

      {showCalendar && (
        <div className={styles.overlay} onClick={() => setShowCalendar(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <DayPicker
              mode="range"
              numberOfMonths={2}
              selected={tempRange}
              onSelect={range => setTempRange(range as DateRange)}
              showOutsideDays
            />
            <button type="button" className={styles.confirm} onClick={handleConfirm}>
              적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
