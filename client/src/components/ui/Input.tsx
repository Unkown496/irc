import React, { ComponentPropsWithRef } from 'react';
import Label from './Label';

interface InputProps
  extends
    React.InputHTMLAttributes<HTMLInputElement>,
    ComponentPropsWithRef<'input'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

function Input({
  label,
  error,
  helperText,
  icon,
  className = '',
  ref,
  ...props
}: InputProps) {
  const baseStyles =
    'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2';
  const normalStyles =
    'border-gray-300 focus:ring-primary-500 focus:border-primary-500';
  const errorStyles = 'border-red-500 focus:ring-red-500';
  const iconStyles = icon ? 'pl-10' : '';

  const inputClasses = `${baseStyles} ${error ? errorStyles : normalStyles} ${iconStyles} ${className}`;

  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={inputClasses}
          ref={ref}
          {...props}
          onChange={e =>
            props?.onChange &&
            props.onChange({
              ...e,
              target: {
                ...e.target,
                value: (props.type === 'number'
                  ? Number(e.target.value)
                  : e.target.value) as any,
              },
            })
          }
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}

export default Input;
