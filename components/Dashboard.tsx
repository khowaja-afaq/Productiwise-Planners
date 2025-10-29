
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
  const overallProgress = Math.round(
    (tasks.filter(t => t.completed).length / tasks.length) * 100
  ) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-text-secondary">Here's your productivity snapshot for today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h2 className="text-lg font-semibold mb-2">Tasks Completed</h2>
          <p className="text-5xl font-bold text-primary">{overallProgress}%</p>
          <p className="text-text-secondary mt-2">{tasks.filter(t => t.completed).length} of {tasks.length} tasks done.</p>
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
            <div key={habit.id} className="bg-background p-4 rounded-lg">
              <p className="font-medium mb-2">{habit.title}</p>
              <div className="w-full bg-border rounded-full h-2.5">
                <div 
                  className="bg-secondary h-2.5 rounded-full" 
                  style={{ width: `${(habit.progress / habit.goal) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-right text-text-secondary mt-1">{habit.progress} / {habit.goal}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
