import { FieldError, UseFormRegister, Path } from 'react-hook-form';
import { LoginFormData, SignupFormData } from '@/lib/schemas/auth';

type FormData = LoginFormData | SignupFormData;

interface FormFieldProps<T extends FormData> {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  disabled?: boolean;
  error?: FieldError;
  register: UseFormRegister<T>;
  name: Path<T>;
}

export default function FormField<T extends FormData>({
  label,
  id,
  type,
  placeholder,
  disabled = false,
  error,
  register,
  name,
}: FormFieldProps<T>) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="input-wrapper">
        <input
          id={id}
          type={type}
          {...register(name)}
          className="input"
          placeholder={placeholder}
          disabled={disabled}
        />
        {error && <p className="error-message">{error.message}</p>}
      </div>
    </div>
  );
}
