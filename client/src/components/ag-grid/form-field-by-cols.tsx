import { ColDef } from 'ag-grid-community';
import { useMemo } from 'react';
import { toInputType } from 'utils/ag-grid';
import Input from '../ui/Input';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface Props<T, D> {
  cols: Array<ColDef<T, D>>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export default function FormFieldsByCols<T, D>({
  cols,

  errors,

  register,
}: Props<T, D>) {
  const inputs = useMemo(
    () =>
      cols
        .filter(
          col =>
            col.editable && !['agSelectCellEditor'].includes(col.cellEditor),
        )
        .map(col => ({
          name: col.field!.toString() ?? '',
          label: col.headerName ?? col.field!.toString(),
          type: toInputType(col),
        })),
    [cols],
  );

  return (
    <>
      {inputs.map(input => {
        return (
          <Input
            {...register(input.name)}
            error={errors[input.name]?.message?.toString()}
            name={input.name}
            type={input.type}
            label={input.label}
          />
        );
      })}
    </>
  );
}
