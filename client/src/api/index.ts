import axios from 'axios';
import { buildPath } from 'utils/path';

const createApiInstance = (path: string) =>
  axios.create({
    baseURL: buildPath(import.meta.env.VITE_API_BASE_URL, path),
  });

export const employeesApiInstance = createApiInstance('employees');
export const departmentsApiInstance = createApiInstance('departments');
