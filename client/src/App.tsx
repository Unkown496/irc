import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet,
} from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import EmployeePage from './pages/EmployeePage';
import UserProfilePage from './pages/UserProfilePage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import { LayoutDashboard, Users, User, Settings } from 'lucide-react';
import RootLayout from './RootLayout';

function AppContent() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: <LayoutDashboard />, path: '/' },
    { id: 'users', label: 'Users', icon: <Users />, path: '/users' },
    { id: 'profile', label: 'Profile', icon: <User />, path: '/profile' },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings />,
      path: '/settings',
    },
  ];

  const pageTitles: { [key: string]: string } = {
    '/': 'Home',
    '/users': 'Users',
    '/profile': 'Profile',
    '/settings': 'Settings',
  };

  const pageTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="flex">
      <Sidebar
        items={navItems}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="md:ml-60 flex-1 w-full">
        <Header
          title={pageTitle}
          userName="John Doe"
          userAvatar="https://i.pravatar.cc/150?img=1"
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <RootLayout>
      <div>
        <Outlet />
      </div>
    </RootLayout>
  );
}
