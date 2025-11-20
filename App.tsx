import React, { useState, useCallback } from 'react';
import { Task, Habit, Priority, CommunityGroup, View, Repetition, UserProfile } from './types';
import Sidebar from './components/Sidebar';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import TasksView from './components/TasksView';
import HabitsView from './components/HabitsView';
import CommunityView from './components/CommunityView';
import CalendarView from './components/CalendarView';
import ProfileView from './components/ProfileView';
import ProductiwiseChat from './components/ProductiwiseChat';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=2d555d&color=fff',
    bio: 'Productivity enthusiast and software developer. I love finding new ways to optimize my workflow and help others do the same.'
  });

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Finalize Q3 report', priority: Priority.High, deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
    { id: '2', title: 'Design new landing page mockups', priority: Priority.Medium, deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
    { id: '3', title: 'Book flight tickets for conference', priority: Priority.Low, deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: true },
  ]);

  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Read 20 pages', goal: 1, progress: 1, repetition: Repetition.Daily, streak: 5 },
    { id: '2', title: 'Drink 8 glasses of water', goal: 8, progress: 4, repetition: Repetition.Daily, streak: 12 },
    { id: '3', title: 'Meditate for 10 minutes', goal: 1, progress: 0, repetition: Repetition.Daily, streak: 0 },
  ]);

  const [communityGroups, setCommunityGroups] = useState<CommunityGroup[]>([
      {
          id: '1',
          name: 'Web Development Squad',
          members: [
              { id: '1', name: 'Alice', avatar: 'https://picsum.photos/id/237/100/100', goal: 'Learn React Native', progress: 75 },
              { id: '2', name: 'Bob', avatar: 'https://picsum.photos/id/238/100/100', goal: 'Master TypeScript', progress: 40 },
              { id: 'u1', name: 'You', avatar: 'https://ui-avatars.com/api/?name=You&background=2d555d&color=fff', goal: 'Build a Portfolio', progress: 50, isCurrentUser: true },
          ]
      },
      {
          id: '2',
          name: 'Book Club',
          members: [
              { id: '3', name: 'Charlie', avatar: 'https://picsum.photos/id/239/100/100', goal: 'Read 50 Books', progress: 60 },
              { id: 'u2', name: 'You', avatar: 'https://ui-avatars.com/api/?name=You&background=2d555d&color=fff', goal: 'Read 20 Books', progress: 25, isCurrentUser: true },
          ]
      }
  ]);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentView('dashboard');
  }, []);

  const handleUpdateProgress = (groupId: string, memberId: string, newProgress: number) => {
    setCommunityGroups(prev => prev.map(group => {
        if (group.id === groupId) {
            return {
                ...group,
                members: group.members.map(member => 
                    member.id === memberId ? { ...member, progress: newProgress } : member
                )
            };
        }
        return group;
    }));
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard tasks={tasks} habits={habits} userProfile={userProfile} />;
      case 'tasks':
        return <TasksView tasks={tasks} setTasks={setTasks} />;
      case 'habits':
        return <HabitsView habits={habits} setHabits={setHabits} />;
      case 'community':
        return <CommunityView groups={communityGroups} onUpdateProgress={handleUpdateProgress} />;
      case 'calendar':
        return <CalendarView tasks={tasks} />;
      case 'profile':
        return <ProfileView profile={userProfile} onSave={handleUpdateProfile} />;
      default:
        return <Dashboard tasks={tasks} habits={habits} userProfile={userProfile} />;
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-background text-text-primary">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout} />
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
        {renderContent()}
      </main>
      <ProductiwiseChat />
    </div>
  );
};

export default App;