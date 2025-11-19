
import React from 'react';
import Button from './ui/Button';
import Logo from './Logo';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-text-primary">
      <div className="text-center p-8 max-w-md w-full bg-surface rounded-2xl shadow-2xl animate-fade-in-up">
        <div className="flex justify-center items-center mb-6">
            <Logo className="w-64 h-auto" type="full" />
        </div>
        <h1 className="text-4xl font-bold mb-2 hidden">Productiwise</h1>
        <p className="mb-8 text-text-secondary text-lg">
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
