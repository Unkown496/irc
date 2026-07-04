import clsx from 'clsx';
import { AllHTMLAttributes, ReactNode } from 'react';

interface Props extends AllHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export default function Label({ children, ...labelProps }: Props) {
  return (
    <label
      {...labelProps}
      className={clsx(
        labelProps?.className,
        'block text-sm font-medium text-gray-700 mb-1',
      )}
    >
      {children}
    </label>
  );
}
