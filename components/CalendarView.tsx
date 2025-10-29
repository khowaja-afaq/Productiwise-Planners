import React, { useState } from 'react';
import { Task } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface CalendarViewProps {
  tasks: Task[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startDay });

  const tasksByDate: { [key: string]: Task[] } = tasks.reduce((acc, task) => {
    const date = task.deadline;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as { [key: string]: Task[] });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const today = new Date();

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold">Calendar</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <Button onClick={prevMonth} variant="ghost">&lt;</Button>
              <h2 className="text-xl font-bold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
              <Button onClick={nextMonth} variant="ghost">&gt;</Button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-text-secondary">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {emptyDays.map((_, index) => <div key={`empty-${index}`} className="border border-border h-28 rounded-md"></div>)}
              {days.map(day => {
                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
                return (
                    <div key={day} className={`border border-border h-28 rounded-md p-1.5 overflow-y-auto ${isToday ? 'bg-secondary bg-opacity-10' : 'bg-background'}`}>
                        <div className={`font-bold text-sm ${isToday ? 'text-secondary' : 'text-text-primary'}`}>{day}</div>
                        <div className="mt-1 space-y-1">
                            {tasksByDate[dateStr]?.map(task => (
                                <div key={task.id} className={`text-xs p-1 rounded ${task.completed ? 'bg-green-100 text-green-700' : 'bg-primary bg-opacity-20 text-primary'} truncate`}>{task.title}</div>
                            ))}
                        </div>
                    </div>
                );
            })}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h2 className="text-lg font-bold mb-4">Sync Calendars</h2>
            <p className="text-text-secondary mb-4">Connect your external calendars to see all your events in one place.</p>
            <div className="space-y-3">
              <Button className="w-full justify-start">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35,11.1H12.9V12.5H21.35A8.2,8.2,0,0,1,13.2,20.7V19.3A6.79,6.79,0,0,0,19.9,12.5H12.9V11.1H21.35A8.2,8.2,0,0,1,21.35,11.1Z M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Z" /></svg>
                Connect Google Calendar
              </Button>
               <Button className="w-full justify-start">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.1l7.8 2.1v15.6l-7.8 2.1-7.8-2.1V4.2L12 2.1M12 1L3 3.7v16.6L12 23l9-2.7V3.7L12 1zm0 5.4l5.2 1.4v2.8l-5.2-1.4v-2.8zm-6.6 0l5.2 1.4v2.8l-5.2-1.4V6.4z" /></svg>
                Connect Outlook Calendar
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
