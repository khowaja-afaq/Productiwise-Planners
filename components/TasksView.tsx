
import React, { useState } from 'react';
import { Task, Priority } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';

interface TasksViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const priorityClasses = {
  [Priority.High]: 'border-red-500 text-red-400',
  [Priority.Medium]: 'border-yellow-500 text-yellow-400',
  [Priority.Low]: 'border-blue-500 text-blue-400',
};

const TaskItem: React.FC<{ task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void; onEdit: (task: Task) => void }> = ({ task, onToggle, onDelete, onEdit }) => {
    return (
        <div className={`flex items-center justify-between bg-background p-4 rounded-lg border-l-4 ${priorityClasses[task.priority]} ${task.completed ? 'opacity-50' : ''}`}>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="ml-4">
                    <p className={`font-medium ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                    <p className="text-sm text-text-secondary">{task.deadline}</p>
                </div>
            </div>
            <div className="space-x-2">
                <Button size="sm" variant="ghost" onClick={() => onEdit(task)}>Edit</Button>
                <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-500 hover:text-white" onClick={() => onDelete(task.id)}>Delete</Button>
            </div>
        </div>
    );
};

const TaskForm: React.FC<{ onSave: (task: Omit<Task, 'id' | 'completed'>) => void; onCancel: () => void; initialTask?: Task | null }> = ({ onSave, onCancel, initialTask }) => {
    const [title, setTitle] = useState(initialTask?.title || '');
    const [priority, setPriority] = useState<Priority>(initialTask?.priority || Priority.Medium);
    const [deadline, setDeadline] = useState(initialTask?.deadline || new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, priority, deadline });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-background border border-border rounded-lg p-2 focus:ring-primary focus:border-primary" />
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full bg-background border border-border rounded-lg p-2 focus:ring-primary focus:border-primary">
                    {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Deadline</label>
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required className="w-full bg-background border border-border rounded-lg p-2 focus:ring-primary focus:border-primary" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Task</Button>
            </div>
        </form>
    );
};

const TasksView: React.FC<TasksViewProps> = ({ tasks, setTasks }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleAddTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
        const newTask: Task = {
            ...taskData,
            id: Date.now().toString(),
            completed: false,
        };
        setTasks(prev => [...prev, newTask]);
        setIsModalOpen(false);
    };
    
    const handleEditTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
        if (!editingTask) return;
        setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
        setEditingTask(null);
        setIsModalOpen(false);
    };

    const handleToggleTask = (id: string) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };

    const handleDeleteTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
    };
    
    const openEditModal = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };
    
    const openAddModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Tasks</h1>
                <Button onClick={openAddModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Task
                </Button>
            </div>

            <Card>
                <div className="space-y-4">
                    {tasks.filter(t => !t.completed).map(task => (
                        <TaskItem key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} onEdit={openEditModal} />
                    ))}
                     {tasks.filter(t => t.completed).length > 0 && <h3 className="text-text-secondary pt-4">Completed</h3>}
                    {tasks.filter(t => t.completed).map(task => (
                        <TaskItem key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} onEdit={openEditModal}/>
                    ))}
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTask ? 'Edit Task' : 'Add New Task'}>
                <TaskForm 
                    onSave={editingTask ? handleEditTask : handleAddTask} 
                    onCancel={() => setIsModalOpen(false)}
                    initialTask={editingTask}
                />
            </Modal>
        </div>
    );
};

export default TasksView;
