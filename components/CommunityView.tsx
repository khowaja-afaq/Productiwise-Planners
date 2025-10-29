
import React from 'react';
import { CommunityMember } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface CommunityViewProps {
  members: CommunityMember[];
}

const CommunityView: React.FC<CommunityViewProps> = ({ members }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Community Goals</h1>
        <Button variant="secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="17" y1="11" x2="23" y2="11"></line></svg>
          Invite Friends
        </Button>
      </div>

      <p className="text-text-secondary">
        Share your goals and progress with your community. Stay motivated together!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => (
          <Card key={member.id} className="text-center flex flex-col items-center">
            <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full mb-4 border-4 border-primary" />
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-text-secondary mt-1 mb-4">{member.goal}</p>
            <div className="w-full bg-background rounded-full h-4">
              <div
                className="bg-secondary h-4 rounded-full text-xs text-white flex items-center justify-center"
                style={{ width: `${member.progress}%` }}
              >
                {member.progress}%
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityView;
