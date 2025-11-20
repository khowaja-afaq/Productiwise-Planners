import { GoogleGenAI, Chat, Type } from "@google/genai";
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

// Task Extraction Schemas and Functions

const taskSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A concise title for the task." },
    description: { type: Type.STRING, description: "A brief description of the task." },
    priority: { type: Type.STRING, enum: ["Low", "Medium", "High"], description: "The priority level of the task." },
    deadline: { type: Type.STRING, description: "The deadline in YYYY-MM-DD format. Use today's date if not specified." },
  },
  required: ["title", "priority", "deadline"],
};

export const extractTaskFromImage = async (base64Image: string): Promise<any> => {
  const genAI = getAI();
  try {
    // Remove header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await genAI.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
          { text: "Analyze this image and extract task details. Identify the task title, description, priority (Low, Medium, High), and deadline (YYYY-MM-DD). If priority is not clear, default to Medium. If deadline is not clear, default to today." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: taskSchema,
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Error extracting task from image:", error);
    throw error;
  }
};

export const extractTaskFromAudio = async (base64Audio: string): Promise<any> => {
  const genAI = getAI();
  try {
    // Remove header if present
    const cleanBase64 = base64Audio.split(',')[1] || base64Audio;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'audio/webm', data: cleanBase64 } }, 
          { text: "Listen to this audio command and extract task details. Identify the task title, description, priority (Low, Medium, High), and deadline (YYYY-MM-DD). If priority is not clear, default to Medium. If deadline is not clear, default to today." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: taskSchema,
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Error extracting task from audio:", error);
    throw error;
  }
};