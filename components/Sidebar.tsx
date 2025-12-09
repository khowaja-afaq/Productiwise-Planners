import React from 'react';
import { View } from '../types';
import Logo from './Logo';
import Button from './ui/Button';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
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

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout, isOpen, onClose }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { id: 'tasks', label: 'Tasks', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> },
    { id: 'habits', label: 'Habits', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg> },
    { id: 'calendar', label: 'Calendar', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
    { id: 'community', label: 'Community', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
  ];

  return (
    <>
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface flex flex-col justify-between border-r border-border transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="mb-8 flex justify-between items-start">
              <div className="flex justify-center w-full md:block md:w-auto">
                <Logo className="w-48 h-auto" type="full" />
              </div>
              <button onClick={onClose} className="md:hidden text-text-secondary hover:text-text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={currentView === item.id}
                onClick={() => {
                  setCurrentView(item.id as View);
                  if (window.innerWidth < 768) {
                    onClose();
                  }
                }}
              />
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          <div className="h-px bg-border my-4 mx-4"></div>
          <nav className="space-y-2 mb-6">
              <NavItem 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
                  label="My Profile"
                  isActive={currentView === 'profile'}
                  onClick={() => {
                    setCurrentView('profile');
                    if (window.innerWidth < 768) {
                      onClose();
                    }
                  }} 
              />
              <NavItem 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>}
                  label="Logout"
                  isActive={false}
                  onClick={onLogout}
              />
          </nav>
          <div className="text-center text-xs text-text-secondary">
              <p>&copy; {new Date().getFullYear()} Productiwise Inc.</p>
              <p>All rights reserved.</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;