
import React from 'react';
import { Task, Habit, Priority } from '../types';
import Card from './ui/Card';

interface DashboardProps {
  tasks: Task[];
  habits: Habit[];
}

const priorityStyles = {
    [Priority.High]: 'bg-red-500',
    [Priority.Medium]: 'bg-yellow-500',
    [Priority.Low]: 'bg-blue-500',
};

const Dashboard: React.FC<DashboardProps> = ({ tasks, habits }) => {
  const upcomingTasks = tasks.filter(t => !t.completed).slice(0, 3);
  const todaysHabits = habits;
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalTasksCount = tasks.length;
  const overallProgress = totalTasksCount === 0 ? 0 : Math.round(
    (completedTasksCount / totalTasksCount) * 100
  );

  // Circular Progress Calculation
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallProgress / 100) * circumference;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-text-secondary">Here's your productivity snapshot for today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-4">Tasks Completed</h2>
          <div className="flex flex-col items-center justify-center mb-2 flex-grow">
            <div className="relative w-40 h-40">
               {/* Background Circle */}
               <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke="#E9ECEF" // Light gray for empty part
                      strokeWidth="10"
                      strokeLinecap="round"
                  />
                  {/* Progress Circle */}
                  <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke="#2d555d" // Primary color
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-1000 ease-out"
                  />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">{overallProgress}%</span>
               </div>
            </div>
            <p className="text-text-secondary mt-4 font-medium">{completedTasksCount} of {totalTasksCount} tasks done.</p>
          </div>
        </Card>
        
        <Card className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Upcoming Tasks</h2>
            <ul className="space-y-3">
                {upcomingTasks.length > 0 ? upcomingTasks.map(task => (
                    <li key={task.id} className="flex items-center justify-between bg-background p-3 rounded-lg">
                        <div className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-3 ${priorityStyles[task.priority]}`}></span>
                            <span className="font-medium">{task.title}</span>
                        </div>
                        <span className="text-sm text-text-secondary">{task.deadline}</span>
                    </li>
                )) : (
                    <p className="text-text-secondary">No upcoming tasks. Great job!</p>
                )}
            </ul>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Today's Habits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {todaysHabits.map(habit => (
            <div key={habit.id} className="bg-background p-5 rounded-lg flex flex-col justify-between h-full">
              <p className="font-medium mb-4">{habit.title}</p>
              <div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div 
                      className="bg-secondary h-2.5 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${Math.min((habit.progress / habit.goal) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-right text-text-secondary">{habit.progress} / {habit.goal}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
