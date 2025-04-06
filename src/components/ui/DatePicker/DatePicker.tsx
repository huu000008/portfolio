'use client';

import { useState, useMemo } from 'react';
import { useFormContext, useController } from 'react-hook-form';
import { format, parseISO, isValid } from 'date-fns';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './DatePicker.module.scss';
import { Modal } from '../Modal/Modal';

interface DatePickerProps {
  name: string;
  id?: string;
  onBlur?: () => void;
}

export const DatePicker = ({ name, id, onBlur }: DatePickerProps) => {
  const { control, setValue, trigger } = useFormContext();

  const {
    field: { value, ref },
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
  const [open, setOpen] = useState(false);

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
    setOpen(false);
    onBlur?.();
  };

  return (
    <div className={styles.wrap}>
      <input type="hidden" name={name} value={value ?? ''} ref={ref} />

      <Modal
        open={open}
        onOpenChange={setOpen}
        trigger={
          <button type="button" id={id} className={styles.trigger} aria-label="날짜 범위 선택">
            {triggerLabel}
          </button>
        }
      >
        <DayPicker
          mode="range"
          numberOfMonths={2}
          selected={tempRange}
          onSelect={range => setTempRange(range as DateRange)}
          showOutsideDays={false}
        />
        <button type="button" className={styles.confirm} onClick={handleConfirm}>
          적용
        </button>
      </Modal>
    </div>
  );
};
