import { Employee } from 'types/employee';
import { employeesApiInstance } from '.';
import { BaseRequest, BaseRequestPagination } from 'types/api';
import { withPaginationParams } from 'utils/api';

interface EmployeesGetAll extends BaseRequestPagination<Employee[]> {}
interface EmployeesCreate extends BaseRequest<true, Employee> {}

export default {
  async get(page: number = 1, limit: number = 10) {
    return employeesApiInstance.get<EmployeesGetAll>(
      '',
      withPaginationParams(page, limit),
    );
  },
  async edit(id: number, data: Partial<Employee>) {
    return employeesApiInstance.patch(`/${id}`, data);
  },
  async delete(id: number) {
    return employeesApiInstance.delete(`/${id}`);
  },
  async create(data: Employee) {
    return employeesApiInstance.post<EmployeesCreate>('', data);
  },
};
