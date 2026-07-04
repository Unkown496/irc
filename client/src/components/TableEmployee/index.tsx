import { ColDef } from 'ag-grid-community';
import type { Employee } from 'types/employee';
import Table from '../ag-grid/Table';
import { createIdCol, toDate } from 'utils/ag-grid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useLoadingState from '../../hooks/useLoadingState';
import employeesApi from '../../api/employees';
import departmentsApi from '../../api/departments';

import { EmployeeSchema } from 'schemas/employee.schemas';
import { Link } from 'react-router-dom';
import { ChildrenAddProps } from '../ui/DialogTableAdd';
import Select, { SelectObject } from '../ui/Select';
import { Department } from 'types/department';
import { uniqBy } from 'utils/array';
import { Controller } from 'react-hook-form';
import TableSelect from '../ag-grid/TableSelect';
import { getAll } from 'utils/api';
import Loader from '../ui/Loader';
import DialogCurrentDepartment from '../ui/DialogCurrentDepartment';
import useToggle from '../../hooks/useToggle';

interface Props {}

function TableEmployeeAdd({ errors, control }: ChildrenAddProps) {
  const [departments, setDepartments] = useState<Department[]>([]),
    [_, setSelectDepartment] = useState<number>();

  const [isLoading, isError, setState] = useLoadingState();

  const [page, setPage] = useState(1);
  const [isMax, setIsMax] = useState(false);

  const items = useMemo(
    () => departments.map(({ name, id }) => ({ text: name, value: id })),
    [departments],
  );

  const fetchDepartments = useCallback(async () => {
    try {
      setState('loading');

      const {
        data: { data: departments, ok, meta },
      } = await departmentsApi.get(1, 10);

      if (!ok) return setState('errored');

      setDepartments(departments);

      setState('ready');

      if (!meta?.nextPage) setIsMax(true);

      return;
    } catch (err) {
      setState('errored');

      return;
    }
  }, []);

  const loadDepartments = useCallback(async () => {
    if (isMax) return;

    const {
      data: { data: departments, ok, meta },
    } = await departmentsApi.get(page + 1, 10);

    if (!ok) return;

    if (meta?.nextPage) {
      setPage(meta?.nextPage);
      setDepartments(before => uniqBy([...before, ...departments], 'id'));
    } else setIsMax(true);

    return;
  }, [page, isMax]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = useCallback((val: SelectObject) => {
    setSelectDepartment(Number(val.value));
  }, []);

  if (isError) return <>Произошла ошибка</>;

  return (
    <Controller
      control={control}
      name="department_id"
      render={({ field: { onChange, name, ref, value } }) => (
        <Select
          label="Отдел"
          name={name}
          ref={ref}
          infinity
          loading={isLoading}
          items={items}
          value={value}
          onLoad={loadDepartments}
          error={errors['department_id']?.message?.toString()}
          onChange={val => {
            onChange(+val.value);
            handleChange(val);
          }}
        />
      )}
    />
  );
}

const createDepartmentCol = (
  values: Array<string | number> = ['Загружается...'],
  setDepartmentId: (id: number) => void,
) =>
  ({
    field: 'department.id',
    headerName: 'Департамент',
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values },
    editable: true,
    cellRendererParams: { setDepartmentId },
    cellRenderer: ({ value, setDepartmentId }: any) => {
      if (!value) return;

      return (
        <p
          className="text-blue-500 underline cursor-pointer"
          onClick={() => setDepartmentId(value)}
        >
          {value}
        </p>
      );
    },
  }) as ColDef;

const createColsDefs = (cols: ColDef[] = []) => [
  createIdCol(),
  {
    field: 'hire_date',
    headerName: 'День найма',
    cellDataType: 'dateString',
    valueFormatter: toDate,
    filter: 'agDateColumnFilter',
    editable: true,
  },
  {
    field: 'name',
    headerName: 'Имя',
    cellDataType: 'text',
    editable: true,
  },
  {
    field: 'salary',
    headerName: 'Зарплата',
    cellDataType: 'number',
    editable: true,
  },
  ...cols,
];

export default function TableEmployee({}: Props) {
  const [colsDefs, setColsDefs] = useState(createColsDefs());

  const [isLoading, _, setState] = useLoadingState();

  const [departmentId, setDepartmentId] = useState(0);

  const [isOpen, toggleOpen] = useToggle();

  const handleClickCurrentDepartment = useCallback(
    (id: number) => {
      console.log({ id });

      setDepartmentId(id);

      toggleOpen();
    },
    [setDepartmentId, toggleOpen],
  );

  const fetchDepartments = useCallback(async () => {
    setState('loading');

    const allDepartments = await getAll(departmentsApi.get);

    if (!allDepartments) return;

    setColsDefs(
      createColsDefs([
        createDepartmentCol(
          allDepartments.map(({ id }) => String(id)),
          handleClickCurrentDepartment,
        ),
      ]),
    );

    setState('ready');
  }, [setDepartmentId]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="w-full h-full">
      <Table
        schema={EmployeeSchema}
        cols={colsDefs}
        domLayout="autoHeight"
        fetchPagination={employeesApi.get}
        fetchAdd={employeesApi.create}
        fetchEdit={employeesApi.edit}
        fetchDelete={employeesApi.delete}
        AddChildren={TableEmployeeAdd}
      />

      <DialogCurrentDepartment
        id={departmentId}
        open={isOpen}
        onClose={toggleOpen}
      />
    </div>
  );
}
