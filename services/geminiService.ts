import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage, GeminiChat } from '../types';

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY is not set in environment variables.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const startChat = (history: ChatMessage[]): Chat => {
  const genAI = getAI();
  return genAI.chats.create({
    model: 'gemini-2.5-flash',
    history: history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    })),
    config: {
        systemInstruction: `You are Productiwise AI, a friendly and insightful productivity assistant.
        You are integrated into a productivity app that helps users manage tasks, track habits, and achieve their goals.
        Your responses should be encouraging, concise, and helpful.
        You can help users break down tasks, suggest new habits, and provide motivation.
        Keep your answers brief and to the point unless asked for more detail. Use markdown for formatting.`
    }
  });
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "I'm sorry, I encountered an error. Please try again.";
  }
};