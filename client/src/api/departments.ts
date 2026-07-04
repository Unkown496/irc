import { withPaginationParams } from 'utils/api';
import { departmentsApiInstance } from '.';
import { BaseRequest, BaseRequestPagination } from 'types/api';
import { Department } from 'types/department';

interface DepartmentGetAll extends BaseRequestPagination<Department[]> {}
interface DepartmentGetCurrent extends BaseRequest<true, Department> {}
interface DepartmentCreate extends BaseRequest<true, Department> {}

export default {
  async get(page?: number, limit?: number) {
    return departmentsApiInstance.get<DepartmentGetAll>(
      '',
      withPaginationParams(page, limit),
    );
  },

  async getById(id: number) {
    return departmentsApiInstance.get<DepartmentGetCurrent>(`/${id}`);
  },

  async edit(id: number, data: Partial<Department>) {
    return departmentsApiInstance.patch(`/${id}`, data);
  },
  async delete(id: number) {
    return departmentsApiInstance.delete(`/${id}`);
  },
  async create(data: Department) {
    return departmentsApiInstance.post<DepartmentCreate>('', data);
  },
};
