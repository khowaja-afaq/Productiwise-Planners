import React, { useState, useRef } from 'react';
import { Task, Priority } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { extractTaskFromImage, extractTaskFromAudio } from '../services/geminiService';

interface TasksViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const priorityBorderClasses = {
  [Priority.High]: 'border-red-500',
  [Priority.Medium]: 'border-yellow-500',
  [Priority.Low]: 'border-blue-500',
};

const checkboxPriorityClasses = {
    [Priority.High]: 'text-red-500 focus:ring-red-500',
    [Priority.Medium]: 'text-yellow-500 focus:ring-yellow-500',
    [Priority.Low]: 'text-blue-500 focus:ring-blue-500',
};

const TaskItem: React.FC<{ task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void; onEdit: (task: Task) => void }> = ({ task, onToggle, onDelete, onEdit }) => {
    return (
        <div className={`group flex items-center justify-between bg-background p-4 rounded-lg border-l-4 transition-all duration-200 ease-in-out ${priorityBorderClasses[task.priority]} ${task.completed ? 'opacity-50' : 'hover:bg-white hover:shadow-md hover:-translate-y-0.5'}`}>
            <div className="flex items-center flex-1 min-w-0">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                    className={`h-5 w-5 rounded border-gray-300 cursor-pointer transition-colors ${checkboxPriorityClasses[task.priority]}`}
                />
                <div className="ml-4 flex-1 min-w-0">
                    <p className={`font-medium truncate ${task.completed ? 'line-through text-text-secondary' : 'text-text-primary'}`}>{task.title}</p>
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-0.5">
                        <p className="text-sm text-text-secondary">{task.deadline}</p>
                        {task.reminder && (
                            <div className="flex items-center text-xs text-text-secondary bg-gray-100 px-2 py-0.5 rounded-full" title="Reminder set">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-secondary"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                {new Date(task.reminder).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </div>
                        )}
                    </div>
                    {task.description && <p className="text-xs text-text-secondary mt-1 truncate max-w-md">{task.description}</p>}
                </div>
            </div>
            <div className="flex space-x-2 ml-4 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                <Button size="sm" variant="ghost" onClick={() => onEdit(task)} className="hover:bg-gray-100">Edit</Button>
                <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-100 hover:text-red-600" onClick={() => onDelete(task.id)}>Delete</Button>
            </div>
        </div>
    );
};

const TaskForm: React.FC<{ onSave: (task: Omit<Task, 'id' | 'completed'>) => void; onCancel: () => void; initialTask?: Task | null }> = ({ onSave, onCancel, initialTask }) => {
    const [title, setTitle] = useState(initialTask?.title || '');
    const [description, setDescription] = useState(initialTask?.description || '');
    const [priority, setPriority] = useState<Priority>(initialTask?.priority || Priority.Medium);
    const [deadline, setDeadline] = useState(initialTask?.deadline || new Date().toISOString().split('T')[0]);
    const [reminder, setReminder] = useState(initialTask?.reminder || '');
    
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, description, priority, deadline, reminder });
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                const extractedData = await extractTaskFromImage(base64);
                if (extractedData) {
                    setTitle(extractedData.title || title);
                    setDescription(extractedData.description || description);
                    if (extractedData.priority && Object.values(Priority).includes(extractedData.priority as Priority)) {
                        setPriority(extractedData.priority as Priority);
                    }
                    if (extractedData.deadline) {
                         setDeadline(extractedData.deadline);
                    }
                }
                setIsAnalyzing(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error(error);
            setIsAnalyzing(false);
            alert("Failed to analyze image.");
        }
    };

    const toggleRecording = async () => {
        if (isRecording) {
            // Stop recording
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
            setIsAnalyzing(true);
        } else {
            // Start recording
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    
                    // Convert blob to base64
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                         const base64 = reader.result as string;
                         try {
                             const extractedData = await extractTaskFromAudio(base64);
                             if (extractedData) {
                                setTitle(extractedData.title || title);
                                setDescription(extractedData.description || description);
                                if (extractedData.priority && Object.values(Priority).includes(extractedData.priority as Priority)) {
                                    setPriority(extractedData.priority as Priority);
                                }
                                if (extractedData.deadline) {
                                    setDeadline(extractedData.deadline);
                                }
                             }
                         } catch (e) {
                             console.error(e);
                             alert("Failed to process audio.");
                         } finally {
                             setIsAnalyzing(false);
                         }
                    };
                    reader.readAsDataURL(audioBlob);
                    
                    // Stop all tracks
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                setIsRecording(true);
            } catch (err) {
                console.error("Error accessing microphone:", err);
                alert("Could not access microphone.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* AI Import Buttons */}
            {!initialTask && (
                <div className="flex space-x-2 mb-4 pb-4 border-b border-border">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isAnalyzing || isRecording}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        Scan Image
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        className="hidden"
                    />

                    <button
                        type="button"
                        onClick={toggleRecording}
                        disabled={isAnalyzing}
                        className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                    >
                        {isRecording ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                                Stop Recording
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                                Voice Command
                            </>
                        )}
                    </button>
                </div>
            )}

            {isAnalyzing && (
                <div className="text-center text-sm text-primary flex items-center justify-center py-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing with Gemini AI...
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                    maxLength={80}
                    className="w-full bg-background border border-border rounded-lg p-2 focus:ring-primary focus:border-primary" 
                />
                <div className="text-xs text-right text-text-secondary mt-1">
                    {title.length}/80
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Add details about this task..."
                    className="w-full bg-background border border-border rounded-lg p-2 focus:ring-primary focus:border-primary resize-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Set Reminder</label>
                <input
                    type="datetime-local"
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-2 focus:ring-primary focus:border-primary"
                />
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
        // Sort tasks by deadline, then priority automatically
        setTasks(prev => {
            const updated = [...prev, newTask];
            return updated.sort((a, b) => {
                // Sort by deadline ascending
                const dateA = new Date(a.deadline).getTime();
                const dateB = new Date(b.deadline).getTime();
                if (dateA !== dateB) return dateA - dateB;
                
                // Then priority (High > Medium > Low)
                const priorityOrder = { [Priority.High]: 0, [Priority.Medium]: 1, [Priority.Low]: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
        });
        setIsModalOpen(false);
    };
    
    const handleEditTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
        if (!editingTask) return;
        setTasks(prev => {
            const updated = prev.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t);
            // Re-sort after edit
            return updated.sort((a, b) => {
                const dateA = new Date(a.deadline).getTime();
                const dateB = new Date(b.deadline).getTime();
                if (dateA !== dateB) return dateA - dateB;
                const priorityOrder = { [Priority.High]: 0, [Priority.Medium]: 1, [Priority.Low]: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
        });
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