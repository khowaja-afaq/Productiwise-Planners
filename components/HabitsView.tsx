
import React, { useState } from 'react';
import { Habit, Repetition } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';

interface HabitsViewProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

const repetitionTextMap: Record<Repetition, string> = {
  [Repetition.Daily]: 'day',
  [Repetition.Weekly]: 'week',
  [Repetition.Monthly]: 'month',
};

const HabitItem: React.FC<{ habit: Habit; onIncrement: (id: string) => void; onDecrement: (id: string) => void; onEdit: (habit: Habit) => void; onDelete: (id: string) => void; }> = ({ habit, onIncrement, onDecrement, onEdit, onDelete }) => {
  const progressPercentage = (habit.progress / habit.goal) * 100;
  const isComplete = habit.progress >= habit.goal;

  return (
    <Card className={`transition-all duration-300 ${isComplete ? 'border-l-4 border-secondary' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{habit.title}</h3>
          <p className="text-text-secondary">{habit.progress} / {habit.goal} completed this {repetitionTextMap[habit.repetition]}</p>
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
       <div className="flex justify-end mt-4 space-x-2">
          <Button size="sm" variant="ghost" onClick={() => onEdit(habit)}>Edit</Button>
          <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-500 hover:text-white" onClick={() => onDelete(habit.id)}>Delete</Button>
      </div>
    </Card>
  );
};

const HabitForm: React.FC<{ onSave: (habit: Omit<Habit, 'id' | 'progress'>) => void; onCancel: () => void; initialHabit?: Habit | null; }> = ({ onSave, onCancel, initialHabit }) => {
    const [title, setTitle] = useState(initialHabit?.title || '');
    const [goal, setGoal] = useState(initialHabit?.goal || 1);
    const [repetition, setRepetition] = useState<Repetition>(initialHabit?.repetition || Repetition.Daily);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && goal > 0) {
            onSave({ title, goal: Number(goal), repetition });
        }
    };

    const goalLabel = `${repetition.charAt(0).toUpperCase()}${repetition.slice(1)} goal`;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g., Read 20 pages"
                    required 
                    className="w-full bg-background border border-border rounded-lg p-2 focus:ring-primary focus:border-primary" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Repetition</label>
                <select 
                    value={repetition} 
                    onChange={(e) => setRepetition(e.target.value as Repetition)}
                    className="w-full bg-background border border-border rounded-lg p-2 focus:ring-primary focus:border-primary"
                >
                    <option value={Repetition.Daily}>Daily</option>
                    <option value={Repetition.Weekly}>Weekly</option>
                    <option value={Repetition.Monthly}>Monthly</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">{goalLabel}</label>
                <input 
                    type="number" 
                    value={goal} 
                    onChange={(e) => setGoal(Number(e.target.value))} 
                    required 
                    min="1"
                    className="w-full bg-background border border-border rounded-lg p-2 focus:ring-primary focus:border-primary" 
                />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Habit</Button>
            </div>
        </form>
    );
};

const HabitsView: React.FC<HabitsViewProps> = ({ habits, setHabits }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleIncrement = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, progress: Math.min(h.goal, h.progress + 1) } : h));
  };
  
  const handleDecrement = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, progress: Math.max(0, h.progress - 1) } : h));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  const handleAddHabit = (habitData: Omit<Habit, 'id' | 'progress'>) => {
    const newHabit: Habit = {
        ...habitData,
        id: Date.now().toString(),
        progress: 0,
    };
    setHabits(prev => [...prev, newHabit]);
    closeModal();
  };

  const handleEditHabit = (habitData: Omit<Habit, 'id' | 'progress'>) => {
    if (!editingHabit) return;
    setHabits(prev => prev.map(h => h.id === editingHabit.id ? { ...h, ...habitData } : h));
    closeModal();
  };
  
  const handleDeleteHabit = (id: string) => {
      setHabits(habits.filter(h => h.id !== id));
  };

  const openAddModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Habit Tracker</h1>
        <Button onClick={openAddModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Habit
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map(habit => (
          <HabitItem
            key={habit.id}
            habit={habit}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onEdit={openEditModal}
            onDelete={handleDeleteHabit}
          />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingHabit ? 'Edit Habit' : 'Add New Habit'}>
        <HabitForm 
            onSave={editingHabit ? handleEditHabit : handleAddHabit} 
            onCancel={closeModal}
            initialHabit={editingHabit}
        />
      </Modal>
    </div>
  );
};

export default HabitsView;
