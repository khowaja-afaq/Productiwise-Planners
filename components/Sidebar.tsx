
import React from 'react';
import { View } from '../types';
import Logo from './Logo';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

// FIX: Changed icon type to React.ReactElement<any> to allow className to be passed via cloneElement.
const NavItem: React.FC<{ icon: React.ReactElement<any>; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
        isActive ? 'bg-primary text-white shadow-lg' : 'text-text-secondary hover:bg-surface hover:text-text-primary'
      }`}
    >
      {React.cloneElement(icon, { className: 'w-6 h-6' })}
      <span className="ml-4 font-medium">{label}</span>
    </button>
  );

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { id: 'tasks', label: 'Tasks', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> },
    { id: 'habits', label: 'Habits', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg> },
    { id: 'calendar', label: 'Calendar', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
    { id: 'community', label: 'Community', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
  ];

  return (
    <aside className="w-64 bg-surface flex-shrink-0 p-6 flex flex-col justify-between border-r border-border">
      <div>
        <div className="mb-8 flex justify-center">
            <Logo className="w-48 h-auto" type="full" />
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={currentView === item.id}
              onClick={() => setCurrentView(item.id as View)}
            />
          ))}
        </nav>
      </div>
      <div className="text-center text-xs text-text-secondary">
        <p>&copy; {new Date().getFullYear()} Productiwise Inc.</p>
        <p>All rights reserved.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
