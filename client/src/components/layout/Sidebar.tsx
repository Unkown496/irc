import { useMemo, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

import clsx from 'clsx';

export interface SidebarItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
}

interface Props {
  items: SidebarItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
interface PropsLinks extends Pick<Props, 'items'> {
  activePath: string;
}

function SidebarLinks({ items, activePath }: PropsLinks) {
  return (
    <nav>
      {items.map(link => (
        <Link
          key={link.id}
          to={link.path}
          className={clsx(
            'flex items-center gap-3 px-6 py-3 transition-colors',
            activePath === link.path
              ? ' bg-primary-500 hover:bg-primary-600'
              : 'text-gray-300 hover:bg-gray-700',
          )}
        >
          {link.icon} <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default function Sidebar({
  items = [],
  isOpen = false,
  setIsOpen = _ => {},
}: Props) {
  const location = useLocation();
  const activePath = useMemo(() => location.pathname, [location]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={clsx(
          'fixed z-50 min-h-svh bg-gray-800 w-60 inset-0 text-white z-30 transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>

        <SidebarLinks items={items} activePath={activePath} />
      </aside>
    </>
  );
}
