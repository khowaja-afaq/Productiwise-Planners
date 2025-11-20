
import React, { useState } from 'react';
import Button from './ui/Button';
import Logo from './Logo';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'welcome' | 'login'>('welcome');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy validation: Username: Admin, Password: 123
    if (username === 'Admin' && password === '123') {
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  const handleSocialLogin = () => {
    alert("This is a demo. Please use Username: Admin, Password: 123");
  };

  if (step === 'welcome') {
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
            <Button onClick={() => setStep('login')} size="lg" className="w-full">
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
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-text-primary">
      <div className="p-8 max-w-md w-full bg-surface rounded-2xl shadow-2xl animate-fade-in-up">
        <div className="flex justify-center items-center mb-6">
            <Logo className="w-48 h-auto" type="full" />
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">Sign In</h2>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Username</label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-3 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter username"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-3 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter password"
                />
            </div>

            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}

            <Button type="submit" size="lg" className="w-full">
                Sign In
            </Button>
        </form>

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-text-secondary">Or continue with</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={handleSocialLogin} className="flex items-center justify-center px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
            </button>
            <button type="button" onClick={handleSocialLogin} className="flex items-center justify-center px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                <svg className="w-5 h-5 mr-2 text-black" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24.35-.44.32-1.02.44-2.05-.38-4.52-4.36-5.34-10.54-.85-12.74 1.87-.82 3.17.19 4.24.54 1.22.31 2.19-.79 3.85-.63 1.6.26 2.78 1.16 3.47 2.3-3.27 1.83-2.48 6.5.63 8.06-.48 1.35-1.35 2.58-2.42 3.63-.64.63-1.14.26-1.76-.53zm-3.54-13.23c.69-3.81 4.4-4.39 4.04-.26-3.59 1.15-4.73-3.29-4.04-3.74z"/>
                </svg>
                Apple
            </button>
        </div>
        
         <div className="mt-6 text-center">
            <button type="button" onClick={() => setStep('welcome')} className="text-sm text-text-secondary hover:text-primary hover:underline">
                Back to Welcome
            </button>
         </div>
      </div>
    </div>
  );
};

export default LoginScreen;
