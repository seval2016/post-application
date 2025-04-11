import Logo from './Logo';
import Search from './Search';
import { HeaderNavigation, BottomNavigation } from '../NavigationMenu';

const Header = () => {
  return (
    <>
      <div className="border-b shadow-md bg-white fixed top-0 w-full z-50">
        <header className="h-[72px] py-4 px-6 flex justify-between items-center container mx-auto">
          <Logo />
          <div className="flex-1 flex justify-center mx-2 sm:mx-4">
            <Search />
          </div>
          <div className="flex items-center gap-4">
            <HeaderNavigation />
          </div>
        </header>
      </div>
      <div className="sm:hidden">
        <BottomNavigation />
      </div>
    </>
  );
};

export default Header; 