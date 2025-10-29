import React from 'react';
import Button from './ui/Button';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex justify-center mb-4">
             <svg className="w-20 h-20 text-primary" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">
                <path d="M256 50.7L64 144v224l192 93.3 192-93.3V144L256 50.7z"/>
                <path d="M64 144l192 93.3 192-93.3"/>
                <path d="M256 50.7v186.6"/>
                <path d="M400 97.3l-144 70"/>
             </svg>
        </div>
        <h1 className="text-5xl font-bold text-primary mb-2" style={{fontFamily: "'Brush Script MT', cursive"}}>Productiwise</h1>
        <p className="text-lg text-text-secondary mb-8">Planners and Productivity</p>
        
        <div className="bg-surface p-8 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-text-primary mb-2">Welcome!</h2>
          <p className="text-text-secondary mb-6">Sign in to continue to your dashboard.</p>
          <div className="space-y-4">
            <Button onClick={onLogin} className="w-full" size="lg">
              Continue with Demo Account
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-text-secondary">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
               <Button variant="ghost" className="w-full border border-border">Google</Button>
               <Button variant="ghost" className="w-full border border-border">Facebook</Button>
               <Button variant="ghost" className="w-full border border-border">Apple</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
