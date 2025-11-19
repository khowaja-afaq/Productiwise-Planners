import React, { useState, useRef, useEffect } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage } from '../types';
import { startChat, sendMessageToGemini } from '../services/geminiService';
import Logo from './Logo';

const ProductiwiseChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chatSession) {
            setChatSession(startChat(history));
        }
    }, [chatSession, history]);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history, isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chatSession) return;

        const newHistory: ChatMessage[] = [...history, { role: 'user', text: userInput }];
        setHistory(newHistory);
        setUserInput('');
        setIsLoading(true);

        try {
            const modelResponse = await sendMessageToGemini(chatSession, userInput);
            setHistory(prev => [...prev, { role: 'model', text: modelResponse }]);
        } catch (error) {
            setHistory(prev => [...prev, { role: 'model', text: "Something went wrong. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
        const isUser = message.role === 'user';
        return (
            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-3 ${isUser ? 'bg-primary text-white' : 'bg-surface text-text-primary shadow-sm'}`}>
                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br />') }} />
                </div>
            </div>
        );
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-primary text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-focus transition-transform transform hover:scale-110 z-50"
                aria-label={isOpen ? "Close Chat" : "Open Chat"}
            >
                {isOpen ? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> :
                    <Logo className="w-8 h-8" variant="monochrome" />
                }
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-background rounded-2xl shadow-2xl flex flex-col z-40 border border-border animate-fade-in-up">
                    <div className="p-4 border-b border-border flex items-center">
                        <Logo className="w-8 h-8" />
                        <h3 className="text-lg font-bold ml-2">Productiwise AI</h3>
                    </div>
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        <ChatBubble message={{role: 'model', text: "Hello! I'm Productiwise AI. How can I help you be more productive today?"}} />
                        {history.map((msg, index) => <ChatBubble key={index} message={msg} />)}
                        {isLoading && <ChatBubble message={{role: 'model', text: "Thinking..."}} />}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
                        <div className="relative">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Ask Productiwise..."
                                className="w-full bg-surface border-border rounded-full py-2 pl-4 pr-12 focus:ring-primary focus:border-primary"
                                disabled={isLoading}
                            />
                            <button type="submit" disabled={isLoading || !userInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary rounded-full text-white disabled:opacity-50 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </div>
                    </form>
                    <style>{`
                        @keyframes fade-in-up {
                          0% {
                            opacity: 0;
                            transform: translateY(20px);
                          }
                          100% {
                            opacity: 1;
                            transform: translateY(0);
                          }
                        }
                        .animate-fade-in-up {
                          animation: fade-in-up 0.3s ease-out forwards;
                        }
                    `}</style>
                </div>
            )}
        </>
    );
};

export default ProductiwiseChat;