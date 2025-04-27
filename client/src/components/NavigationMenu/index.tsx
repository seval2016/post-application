import React from 'react';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';
import '../../styles/NavigationMenu/NavigationMenu.css';

const NavigationMenu = () => {
  return (
    <>
      <div className="hidden md:block">
        <DesktopMenu />
      </div>
      <div className="md:hidden">
        <MobileMenu />
      </div>
    </>
  );
};

export default NavigationMenu; 