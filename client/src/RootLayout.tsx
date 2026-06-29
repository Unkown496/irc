import { PropsWithChildren, useMemo } from 'react';
import Sidebar, { SidebarItem } from './components/layout/Sidebar';

import links from 'constants/links';
import titles from 'constants/titles';

import Header from './components/layout/Header';
import useToggle from './hooks/useToggle';
import { useLocation } from 'react-router-dom';

interface Props extends PropsWithChildren {}

export default function RootLayout({ children }: Props) {
  const sidebarItems = links.map(
    link =>
      ({
        ...link,
        path: link.href,
        label: link.title,
      }) as SidebarItem,
  ) as Array<SidebarItem>;

  const [isMenuOpen, toggleMenu, setIsOpenMenu] = useToggle(false);

  const location = useLocation();

  const title = useMemo(
    () => titles[location.pathname] ?? 'Default title',
    [location],
  );

  return (
    <div className="flex">
      <Sidebar
        items={sidebarItems}
        isOpen={isMenuOpen}
        setIsOpen={setIsOpenMenu}
      />

      <div className="md:ml-60 flex-1 w-full">
        <Header onMenuClick={toggleMenu} title={title} />

        <main>{children}</main>
      </div>
    </div>
  );
}
