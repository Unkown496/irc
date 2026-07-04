import { Outlet } from 'react-router-dom';
import RootLayout from './RootLayout';

export default function App() {
  return (
    <RootLayout>
      <div>
        <Outlet />
      </div>
    </RootLayout>
  );
}
