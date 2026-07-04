import {
  CellEditingStoppedEvent,
  ColDef,
  DoesExternalFilterPass,
  GridReadyEvent,
  IDatasource,
  IRowNode,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import {
  ChangeEvent,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Pen, RotateCcw, Search, Trash } from 'lucide-react';
import { AxiosResponse } from 'axios';
import { BaseRequest, BaseRequestPagination } from 'types/api';
import useResize from '../../hooks/useResize';
import useToggle from '../../hooks/useToggle';
import DialogTableAdd, { ChildrenAdd } from '../ui/DialogTableAdd';
import { ZodObject } from 'zod';
import { toast } from 'react-toastify';
import { ID_COL_KEY } from 'constants/ag-grid';
import { toInputType, transformNestedCol } from 'utils/ag-grid';
import Select, { SelectObject } from '../ui/Select';

type EditRows = Record<number, { newValue: Record<string, any> }>;

interface Props<T extends object, S extends ZodObject> extends Omit<
  AgGridReactProps<T>,
  | 'singleClickEdit'
  | 'stopEditingWhenCellsLoseFocus'
  | 'rowModelType'
  | 'rowSelection'
> {
  ref?: RefObject<AgGridReact<T>>;
  cols: Array<ColDef<T, unknown>>;

  datasource?: IDatasource;

  page?: number;
  limit?: number;

  fetchPagination(
    page?: number,
    limit?: number,
  ): Promise<AxiosResponse<BaseRequestPagination<T[]>>>;

  fetchAdd(data: T): Promise<AxiosResponse<BaseRequest<true, T>>>;
  fetchEdit(
    id: number,
    data: Partial<T>,
  ): Promise<AxiosResponse<BaseRequest<true, T>>>;
  fetchDelete(id: number): Promise<AxiosResponse>;

  schema: S;

  AddChildren?: ChildrenAdd;
}

interface PropsTableActions {
  onDelete?: VoidFunction;
  onEdit?: VoidFunction;
  onUndo?: VoidFunction;
  onAdd?: VoidFunction;

  shows: string[];
}

function TableActions({
  onDelete = () => {},
  onEdit = () => {},
  onUndo = () => {},
  onAdd = () => {},
  shows = [],
}: PropsTableActions) {
  return (
    <div className="flex gap-3">
      <div className="flex gap-1">
        <Button onClick={onAdd}>Добавить</Button>
        {shows.includes('delete') && (
          <Button icon={<Trash />} onClick={onDelete}>
            Удалить
          </Button>
        )}
      </div>

      {shows.includes('edit') && (
        <div className="flex gap-1">
          <Button icon={<Pen />} onClick={onEdit}>
            Сохранить изменения
          </Button>
          <Button icon={<RotateCcw />} onClick={onUndo}>
            Отменить изменения
          </Button>
        </div>
      )}
    </div>
  );
}

export default function Table<T extends object, S extends ZodObject>({
  fetchPagination,
  fetchAdd,
  fetchEdit,
  fetchDelete,

  ref,

  schema,

  datasource,
  limit = 10,
  cols,
  AddChildren,

  ...tableProps
}: Props<T, S>) {
  const tableRef = useRef<AgGridReact<T>>(null);

  const tableDatasource = useMemo(() => {
    if (!fetchPagination) return;

    const { getRows, ...datasourceWithoutGetRows } = datasource ?? {};

    return {
      ...datasourceWithoutGetRows,
      async getRows({ startRow, successCallback, failCallback, ...params }) {
        if (!!getRows)
          getRows({
            startRow,
            successCallback,
            failCallback,
            ...params,
          });

        const nextPage = Math.floor(startRow / limit) + 1;
        try {
          const dataRequest = await fetchPagination(nextPage, limit);

          const { data, ok, meta } = dataRequest.data;

          if (!meta) return failCallback();
          if (!ok) return failCallback();

          return successCallback(data, meta.total);
        } catch (err) {
          console.error(err);

          return failCallback();
        }
      },
    } as IDatasource;
  }, [limit, datasource, fetchPagination]);

  const idCol = useMemo(() => {
    return cols.find(col => col.colId === ID_COL_KEY);
  }, [cols]);

  const handleGridReady = useCallback(
    (ev: GridReadyEvent<T>) => {
      if (tableProps?.onGridReady) tableProps.onGridReady(ev);

      ev.api.sizeColumnsToFit();

      if (!tableDatasource) return;

      ev.api.setGridOption('datasource', tableDatasource);
    },
    [tableDatasource],
  );

  useResize(() => {
    if (!tableRef.current) return;

    tableRef.current.api.sizeColumnsToFit();
  }, [tableRef]);

  const [isOpenAdd, toggleAdd] = useToggle();

  const [editRows, setEditRows] = useState<EditRows>({}),
    [selectRows, setSelectRows] = useState<T[]>([]);

  const refreshRows = useCallback(() => {
    if (!tableRef?.current) return;

    tableRef.current.api.refreshInfiniteCache();
    tableRef.current.api.refreshCells({ force: true });

    setEditRows({});

    if (selectRows.length) tableRef.current.api.deselectAll();

    return;
  }, [tableRef, setEditRows, selectRows]);

  const handleSelect = useCallback(
    (ev: SelectionChangedEvent<T>) => {
      if (tableProps?.onSelectionChanged) tableProps.onSelectionChanged(ev);

      return setSelectRows(ev.api.getSelectedRows());
    },
    [tableProps],
  );

  const handleAdd = useCallback(() => {
      toggleAdd();

      return;
    }, [toggleAdd, refreshRows, tableRef]),
    handleDelete = useCallback(async () => {
      if (!selectRows.length) return toast('Колонки не выбраны!');
      if (!idCol) return toast('id Колонка не найдена или не задана!');

      try {
        for await (const row of selectRows) {
          const id = row[idCol.field! as unknown as keyof T] as number;

          if (!id) {
            toast('Произошла ошибка при удалении');
            continue;
          }

          await fetchDelete(id);
        }

        setSelectRows([]);

        refreshRows();

        toast(`Успешное удаление ${selectRows.length} колонок`);
      } catch (err) {
        console.log(err);
        toast('Произошла ошибка при удалении');
      }
    }, [selectRows, refreshRows]),
    handleEdit = useCallback(
      (ev: CellEditingStoppedEvent<T, T>) => {
        if (tableProps?.onCellEditingStopped)
          tableProps?.onCellEditingStopped(ev);

        const { rowIndex, column, oldValue, newValue, data } = ev;

        if (rowIndex === null) return;
        if (!data) return;

        if (oldValue === newValue) return;

        const colId = transformNestedCol(column.getColDef());

        if (!colId) return;

        const indexOfRow =
          (data[idCol?.field as unknown as keyof T] as unknown as number) ??
          rowIndex;

        setEditRows(beforeEditRows => {
          const currentRowEdit = beforeEditRows[rowIndex];

          if (!currentRowEdit)
            return {
              ...beforeEditRows,
              [indexOfRow]: {
                newValue: {
                  [colId]: newValue,
                },
              },
            };

          return {
            ...beforeEditRows,
            [indexOfRow]: {
              newValue: {
                ...currentRowEdit?.newValue,
                [colId]: newValue,
              },
            },
          };
        });

        return;
      },
      [tableProps, setEditRows],
    ),
    handleUndo = useCallback(refreshRows, [refreshRows]);

  const handleAddSubmitData = useCallback(
    async (data: T) => {
      try {
        await fetchAdd(data);
        refreshRows();

        handleAdd();
      } catch (err) {
        toast('Произошла ошибка при добавлении');
      }
    },
    [fetchAdd, refreshRows, handleAdd],
  );

  const handleSaveEdit = useCallback(async () => {
    try {
      if (!idCol) return toast('id Колонка не найдена или не задана!');

      for await (const [rowIdString, { newValue }] of Object.entries(
        editRows,
      )) {
        const rowId = Number(rowIdString);

        if (isNaN(rowId)) continue;

        const { data, error } = schema.partial().safeParse(newValue);

        if (error) {
          toast(error.message);
          continue;
        }

        await fetchEdit(rowId, data as Partial<T>);
      }

      toast('Успешно обновлено!');

      refreshRows();
    } catch (err) {
      console.error(err);
      toast('Произошла ошибка при сохранении изменений!');
    }
  }, [editRows, idCol, fetchEdit, refreshRows]);

  const showActions = useMemo(
    () =>
      [
        Object.keys(editRows).length > 0 ? 'edit' : false,
        selectRows.length > 0 ? 'delete' : false,
      ].filter(Boolean) as ['edit', 'delete'],
    [editRows, selectRows],
  );

  return (
    <div className="flex flex-col gap-2">
      <TableActions
        onAdd={handleAdd}
        onDelete={handleDelete}
        onEdit={handleSaveEdit}
        onUndo={handleUndo}
        shows={showActions}
      />

      <AgGridReact
        {...tableProps}
        stopEditingWhenCellsLoseFocus
        rowModelType="infinite"
        cacheBlockSize={limit}
        rowSelection={{ mode: 'multiRow' }}
        columnDefs={cols}
        onCellEditingStopped={handleEdit}
        onSelectionChanged={handleSelect}
        ref={agGridRef => {
          if (!agGridRef) return;

          tableRef.current = agGridRef;
          if (ref?.current) ref.current = agGridRef;
        }}
        onGridReady={handleGridReady}
      />

      <DialogTableAdd
        schema={schema}
        colsDef={cols}
        open={isOpenAdd}
        onClose={handleAdd}
        onSubmitData={handleAddSubmitData}
      >
        {AddChildren}
      </DialogTableAdd>
    </div>
  );
}
