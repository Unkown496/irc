import { createBrowserRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import EmployeePage from '../pages/EmployeePage';
import App from '../App';

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: DashboardPage },
      {
        path: 'departments',
      },
      { path: 'employee', Component: EmployeePage },
    ],
  },
]);

export default router;
