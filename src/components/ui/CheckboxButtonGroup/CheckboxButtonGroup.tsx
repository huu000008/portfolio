'use client';

import { useWatch, useFormContext } from 'react-hook-form';
import styles from './CheckboxButtonGroup.module.scss';

interface CheckboxButtonGroupProps {
  name: string;
  options: string[];
}

export const CheckboxButtonGroup = ({ name, options }: CheckboxButtonGroupProps) => {
  const { register, control } = useFormContext();
  const values: string[] = useWatch({ control, name }) || [];

  return (
    <div className={styles.wrap}>
      {options.map(option => {
        const isChecked = values.includes(option);
        return (
          <label key={option} className={`${styles.button} ${isChecked ? styles.checked : ''}`}>
            <input type="checkbox" value={option} {...register(name)} className={styles.input} />
            {option}
          </label>
        );
      })}
    </div>
  );
};
