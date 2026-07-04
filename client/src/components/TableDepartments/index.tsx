import Table from '../ag-grid/Table';
import { DepartmentSchema } from 'schemas/departments.schemas';
import departmentsApi from '../../api/departments';
import { createIdCol, toDate } from 'utils/ag-grid';
import { ColDef } from 'ag-grid-community';
import { Department } from 'types/department';

const colsDefs = [
  createIdCol(),
  {
    field: 'budget',
    headerName: 'Бюджет',
    cellDataType: 'number',
    editable: true,
  },
  {
    field: 'name',
    headerName: 'Название',
    editable: true,
  },
  {
    field: 'established_date',
    headerName: 'День основания',
    cellDataType: 'dateString',
    valueFormatter: toDate,
    filter: 'agDateColumnFilter',
    editable: true,
  },
] as ColDef<Department>[];

export default function DepartmentsTable() {
  return (
    <Table
      cols={colsDefs}
      domLayout="autoHeight"
      fetchPagination={departmentsApi.get}
      fetchAdd={departmentsApi.create}
      fetchEdit={departmentsApi.edit}
      fetchDelete={departmentsApi.delete}
      schema={DepartmentSchema}
    />
  );
}
