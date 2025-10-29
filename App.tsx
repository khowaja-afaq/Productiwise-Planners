import React, { useState, useCallback } from 'react';
import { Task, Habit, Priority, CommunityMember, View } from './types';
import Sidebar from './components/Sidebar';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import TasksView from './components/TasksView';
import HabitsView from './components/HabitsView';
import CommunityView from './components/CommunityView';
import CalendarView from './components/CalendarView';
import ProductiwiseChat from './components/ProductiwiseChat';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Finalize Q3 report', priority: Priority.High, deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
    { id: '2', title: 'Design new landing page mockups', priority: Priority.Medium, deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
    { id: '3', title: 'Book flight tickets for conference', priority: Priority.Low, deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: true },
  ]);

  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Read 20 pages', goal: 1, progress: 1 },
    { id: '2', title: 'Drink 8 glasses of water', goal: 8, progress: 4 },
    { id: '3', title: 'Meditate for 10 minutes', goal: 1, progress: 0 },
  ]);

  const [communityMembers] = useState<CommunityMember[]>([
      { id: '1', name: 'Alice', avatar: 'https://picsum.photos/id/237/100/100', goal: 'Learn React Native', progress: 75 },
      { id: '2', name: 'Bob', avatar: 'https://picsum.photos/id/238/100/100', goal: 'Run a marathon', progress: 40 },
      { id: '3', name: 'Charlie', avatar: 'https://picsum.photos/id/239/100/100', goal: 'Write a novel', progress: 60 },
  ]);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard tasks={tasks} habits={habits} />;
      case 'tasks':
        return <TasksView tasks={tasks} setTasks={setTasks} />;
      case 'habits':
        return <HabitsView habits={habits} setHabits={setHabits} />;
      case 'community':
        return <CommunityView members={communityMembers} />;
      case 'calendar':
        return <CalendarView tasks={tasks} />;
      default:
        return <Dashboard tasks={tasks} habits={habits} />;
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-background text-text-primary">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
        {renderContent()}
      </main>
      <ProductiwiseChat />
    </div>
  );
};

export default App;