import {
  ColDef,
  ValueGetterParams,
  type ValueFormatterParams,
} from 'ag-grid-community';
import { ID_COL_KEY } from 'constants/ag-grid';
import { HTMLInputTypeAttribute } from 'react';

export const toDate = <T extends ValueFormatterParams<any>>({ value }: T) =>
  new Date(value).toLocaleDateString('ru-RU');

export const toInputType = <D = any, V = any>(
  col: ColDef<D, V>,
): HTMLInputTypeAttribute => {
  const { cellDataType } = col;

  if (!cellDataType) return 'text';

  switch (cellDataType) {
    case 'number':
    case 'bigint':
      return 'number';

    case 'boolean':
      return 'checkbox';

    case 'date':
    case 'dateString':
      return 'date';

    case 'dateTime':
    case 'dateTimeString':
      return 'datetime-local';

    case 'text':
    default:
      return 'text';
  }
};

export const createIdCol = (colDef?: ColDef) =>
  ({
    ...colDef,
    field: 'id',
    headerName: colDef?.headerName ?? 'id',
    colId: ID_COL_KEY,
    editable: false,
  }) as ColDef;

export const isNestedCol = (colDef: ColDef) => colDef.field?.includes('.');

export const transformNestedCol = (colDef: ColDef) =>
  isNestedCol(colDef) ? colDef.field?.replace('.', '_') : colDef.field;
