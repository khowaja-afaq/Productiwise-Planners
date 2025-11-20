import React from 'react';
import { CommunityGroup } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface CommunityViewProps {
  groups: CommunityGroup[];
  onUpdateProgress: (groupId: string, memberId: string, newProgress: number) => void;
}

const CommunityView: React.FC<CommunityViewProps> = ({ groups, onUpdateProgress }) => {
    const copyInviteLink = (groupName: string) => {
        // In a real app, this would copy a unique link to the clipboard
        alert(`Invite link for "${groupName}" copied to clipboard! (Simulated)`);
    };

    const extractGoalNumber = (goal: string): number | null => {
        const match = goal.match(/\d+/);
        return match ? parseInt(match[0], 10) : null;
    };

    const calculateCurrentValue = (progress: number, goalTarget: number | null) => {
        if (!goalTarget) return progress; // Default to percentage if no number found
        return Math.round((progress / 100) * goalTarget);
    };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-text-secondary mt-2">
          Join groups, track goals, and grow together.
        </p>
      </div>

      {groups.map(group => (
          <div key={group.id} className="space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-2">
                  <h2 className="text-xl font-bold">{group.name}</h2>
                  <Button variant="secondary" size="sm" onClick={() => copyInviteLink(group.name)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="17" y1="11" x2="23" y2="11"></line></svg>
                    Invite Friends
                  </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.members.map(member => {
                    const goalTarget = extractGoalNumber(member.goal);
                    const currentValue = calculateCurrentValue(member.progress, goalTarget);
                    
                    // Special rendering for the current user ("You")
                    if (member.isCurrentUser) {
                      const radius = 35;
                      const circumference = 2 * Math.PI * radius;
                      const strokeDashoffset = circumference - (member.progress / 100) * circumference;

                      return (
                        <Card key={member.id} className="text-center flex flex-col items-center transition-all duration-300 ring-2 ring-secondary ring-offset-2 border-secondary relative">
                          {/* Circular Progress Indicator for "You" */}
                          <div className="relative w-24 h-24 mb-4">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                                {/* Background Circle */}
                                <circle cx="40" cy="40" r={radius} stroke="#E9ECEF" strokeWidth="6" fill="none" />
                                {/* Progress Circle */}
                                <circle 
                                  cx="40" 
                                  cy="40" 
                                  r={radius} 
                                  stroke="#2d555d" 
                                  strokeWidth="6" 
                                  fill="none" 
                                  strokeDasharray={circumference} 
                                  strokeDashoffset={strokeDashoffset} 
                                  strokeLinecap="round" 
                                />
                            </svg>
                            <span className="absolute bottom-0 right-0 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full transform translate-x-1 translate-y-1 shadow-sm">
                              You
                            </span>
                          </div>

                          <h3 className="text-xl font-semibold">{member.name}</h3>
                          <p className="text-text-secondary mt-1 mb-4">{member.goal}</p>

                          <div className="w-full mt-auto space-y-2">
                              <div className="flex justify-between items-center text-xs text-text-secondary mb-1">
                                  <span>Progress</span>
                                  <span className="font-semibold text-text-primary">{member.progress}%</span>
                              </div>
                              
                              <div className="relative w-full h-3 bg-gray-200 rounded-full">
                                  <div 
                                      className="absolute top-0 left-0 h-full bg-secondary rounded-full" 
                                      style={{ width: `${member.progress}%` }} 
                                  />
                                  <input 
                                      type="range" 
                                      min="0" 
                                      max="100" 
                                      value={member.progress} 
                                      onChange={(e) => onUpdateProgress(group.id, member.id, parseInt(e.target.value))}
                                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                                      title="Drag to update progress"
                                  />
                              </div>
                              
                              {/* X out of Y Text */}
                              {goalTarget && (
                                  <div className="text-right text-blue-400 text-sm font-medium">
                                      {currentValue} out of {goalTarget}
                                  </div>
                              )}
                          </div>
                        </Card>
                      );
                    }

                    // Standard Card for other members
                    return (
                      <Card key={member.id} className="text-center flex flex-col items-center transition-all duration-300">
                        <div className="relative">
                            <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full mb-4 border-4 border-primary object-cover" />
                        </div>
                        <h3 className="text-xl font-semibold">{member.name}</h3>
                        <p className="text-text-secondary mt-1 mb-4">{member.goal}</p>
                        
                        <div className="w-full mt-auto">
                            <div className="flex justify-between text-xs text-text-secondary mb-1">
                                <span>Progress</span>
                                <span>{member.progress}%</span>
                            </div>
                            <div className="w-full bg-background rounded-full h-4 overflow-hidden">
                              <div
                                className="bg-secondary h-full rounded-full text-xs text-white flex items-center justify-center transition-all duration-500"
                                style={{ width: `${member.progress}%` }}
                              >
                              </div>
                            </div>
                        </div>
                      </Card>
                    );
                })}
              </div>
          </div>
      ))}
      
      {groups.length === 0 && (
          <div className="text-center py-10 text-text-secondary">
              <p>You haven't joined any communities yet.</p>
              <Button className="mt-4">Browse Communities</Button>
          </div>
      )}
    </div>
  );
};

export default CommunityView;