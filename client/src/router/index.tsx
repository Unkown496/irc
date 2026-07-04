import { createBrowserRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import EmployeePage from '../pages/EmployeePage';
import App from '../App';
import DepartmentsPage from '../pages/DepartmentsPage';

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: DashboardPage },
      {
        path: 'departments',
        children: [{ path: ':id', Component: DepartmentsPage }],
        Component: DepartmentsPage,
      },
      { path: 'employee', Component: EmployeePage },
    ],
  },
]);

export default router;
