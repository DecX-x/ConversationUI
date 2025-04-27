import React from 'react';
import { MessageSquare } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary/10 p-1.5 rounded-md">
        <MessageSquare className="w-5 h-5 text-primary" />
      </div>
      <span className="font-semibold text-lg">ChatAssist</span>
    </div>
  );
}