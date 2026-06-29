import { Building2, Home, IdCardIcon } from 'lucide-react';

export default [
  {
    id: 'Home',
    href: '/',
    title: 'Главная',
    icon: <Home />,
  },
  {
    id: 'Employee',
    href: '/employee',
    title: 'Сотрудники',
    icon: <IdCardIcon />,
  },
  {
    id: 'Department',
    href: '/departments',
    title: 'Отделы',
    icon: <Building2 />,
  },
];
