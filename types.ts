import { Chat } from '@google/genai';

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum Repetition {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export type View = 'dashboard' | 'tasks' | 'habits' | 'community' | 'calendar';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  deadline: string;
  completed: boolean;
  reminder?: string;
}

export interface Habit {
  id: string;
  title: string;
  goal: number; // e.g., 5 times a week
  repetition: Repetition;
  progress: number;
}

export interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  goal: string;
  progress: number;
  isCurrentUser?: boolean;
}

export interface CommunityGroup {
  id: string;
  name: string;
  members: CommunityMember[];
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