
import React from 'react';
import { Habit } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface HabitsViewProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

const HabitItem: React.FC<{ habit: Habit; onIncrement: (id: string) => void; onDecrement: (id: string) => void; }> = ({ habit, onIncrement, onDecrement }) => {
  const progressPercentage = (habit.progress / habit.goal) * 100;
  const isComplete = habit.progress >= habit.goal;

  return (
    <Card className={`transition-all duration-300 ${isComplete ? 'border-l-4 border-secondary' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{habit.title}</h3>
          <p className="text-text-secondary">{habit.progress} / {habit.goal} completed</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost" onClick={() => onDecrement(habit.id)} disabled={habit.progress <= 0}>-</Button>
          <Button size="sm" variant="ghost" onClick={() => onIncrement(habit.id)} disabled={isComplete}>+</Button>
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-background rounded-full h-2.5">
          <div
            className={`${isComplete ? 'bg-secondary' : 'bg-primary'} h-2.5 rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${progressPercentage > 100 ? 100 : progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

const HabitsView: React.FC<HabitsViewProps> = ({ habits, setHabits }) => {

  const handleIncrement = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, progress: Math.min(h.goal, h.progress + 1) } : h));
  };
  
  const handleDecrement = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, progress: Math.max(0, h.progress - 1) } : h));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Habit Tracker</h1>
        {/* Add new habit functionality can be added here */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map(habit => (
          <HabitItem
            key={habit.id}
            habit={habit}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        ))}
      </div>
    </div>
  );
};

export default HabitsView;
