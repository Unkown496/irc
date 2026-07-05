import { type ColDef } from 'ag-grid-community';
import { ReactNode } from 'react';
import Button from './Button';
import {
  Control,
  FieldErrors,
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { ZodObject } from 'zod';
import FormFieldsByCols from '../ag-grid/form-field-by-cols';
import Dialog from './Dialog';

export type ChildrenAddProps = {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: Control<any, any, any>;
};
export type ChildrenAdd = (props: ChildrenAddProps) => ReactNode;

interface Props<T, S extends ZodObject> {
  open: boolean;
  onClose: VoidFunction;
  colsDef: ColDef<T, any>[];

  onSubmitData?: (data: T) => void;

  schema: S;

  children?: ChildrenAdd;
}

export default function DialogTableAdd<T, S extends ZodObject>({
  onClose = () => {},
  open = false,

  onSubmitData = _ => {},

  schema,

  children,

  colsDef,
}: Props<T, S>) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FieldValues> = data => {
    console.log({ data });

    onSubmitData(data as T);
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} transition title="Добавить">
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit, console.log)}
      >
        <FormFieldsByCols cols={colsDef} register={register} errors={errors} />
        {children && children({ register, control: control as any, errors })}

        <div className="flex gap-2">
          <Button type="submit">Отправить</Button>
          <Button onClick={onClose}>Отменить </Button>
        </div>
      </form>
    </Dialog>
  );
}
