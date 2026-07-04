import {
  Dialog as DialogElement,
  DialogPanel,
  DialogTitle,
  DialogProps,
} from '@headlessui/react';
import clsx from 'clsx';
import { Car, X } from 'lucide-react';
import { type ReactNode } from 'react';
import Card from './Card';

interface Props extends DialogProps {
  title: string;
  children: ReactNode;
}

export default function Dialog({ title, children, ...dialogProps }: Props) {
  return (
    <DialogElement
      {...dialogProps}
      className={clsx(
        'fixed w-full h-full top-0 flex justify-center items-center z-[9999]',
        dialogProps?.className,
      )}
    >
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

      <DialogPanel className="z-10 relative max-w-[300px]">
        <Card className="flex flex-col gap-5">
          <DialogTitle as="div" className="flex justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {title}
            </h3>

            <X type="button" onClick={() => dialogProps.onClose(true)} />
          </DialogTitle>

          {children}
        </Card>
      </DialogPanel>
    </DialogElement>
  );
}
