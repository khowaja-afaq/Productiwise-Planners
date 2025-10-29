import { Chat } from '@google/genai';

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export type View = 'dashboard' | 'tasks' | 'habits' | 'community' | 'calendar';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  deadline: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  title: string;
  goal: number; // e.g., times per day
  progress: number;
}

export interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  goal: string;
  progress: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GeminiChat {
    chat: Chat | null;
    history: ChatMessage[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  source: 'google' | 'outlook' | 'productiwise';
}