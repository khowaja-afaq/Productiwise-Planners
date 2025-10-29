import React from 'react';
import Button from './ui/Button';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-text-primary">
      <div className="text-center p-8 max-w-md w-full bg-surface rounded-2xl shadow-2xl animate-fade-in-up">
        <div className="flex justify-center items-center mb-6">
            <svg className="w-20 h-20 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 7.5L12 4L19 7.5V16.5L12 20L5 16.5V7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11L19 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11L5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
        <h1 className="text-4xl font-bold">Welcome to Productiwise</h1>
        <p className="mt-4 mb-8 text-text-secondary">
          Your personal AI-powered productivity assistant.
        </p>
        <Button onClick={onLogin} size="lg" className="w-full">
          Log In & Get Started
        </Button>
      </div>
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
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;