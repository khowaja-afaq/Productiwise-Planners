import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface ProfileViewProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, avatar: reader.result as string });
        };
        reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
      if (isEditing) {
          fileInputRef.current?.click();
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
  };

  return (
     <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <div className="max-w-2xl mx-auto">
        <Card>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center mb-8">
                    <div 
                        className={`relative group ${isEditing ? 'cursor-pointer' : ''}`} 
                        onClick={handleAvatarClick}
                        title={isEditing ? "Click to upload new picture" : ""}
                    >
                        <img src={formData.avatar} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-md mb-4" />
                        {isEditing && (
                            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            </div>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                    </div>
                    {!isEditing && (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-primary">{formData.name}</h2>
                            <p className="text-text-secondary">{formData.email}</p>
                        </div>
                    )}
                </div>
                
                {isEditing ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                            <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-2 focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                            <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-2 focus:ring-primary focus:border-primary" />
                        </div>
                        {/* Avatar URL input removed as requested */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Bio</label>
                            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full bg-background border border-border rounded-lg p-2 focus:ring-primary focus:border-primary resize-none" />
                        </div>
                        <div className="flex justify-end space-x-3 pt-4 border-t border-border mt-6">
                            <Button type="button" variant="ghost" onClick={() => {
                                setFormData(profile);
                                setIsEditing(false);
                            }}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">About Me</h3>
                            <p className="text-text-primary leading-relaxed">{formData.bio || "No bio set yet. Click edit to tell us about yourself!"}</p>
                        </div>
                        
                        <div className="pt-6 border-t border-border flex justify-center">
                            <Button type="button" onClick={() => setIsEditing(true)} className="w-full sm:w-auto">Edit Profile</Button>
                        </div>
                    </div>
                )}
            </form>
        </Card>
      </div>
     </div>
  );
};

export default ProfileView;