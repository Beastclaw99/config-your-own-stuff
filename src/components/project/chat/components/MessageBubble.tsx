
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Reply } from 'lucide-react';
import type { ProjectMessage } from '../types';

interface MessageBubbleProps {
  message: ProjectMessage;
  isOwnMessage: boolean;
  onReply: (message: ProjectMessage) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  onReply
}) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${
        isOwnMessage ? 'bg-ttc-blue-700 text-white' : 'bg-gray-100'
      } rounded-lg px-4 py-2`}>
        {message.parent_message && (
          <div className="mb-2 p-2 bg-black/10 rounded text-sm">
            <div className="font-medium">{message.parent_message.sender_name}</div>
            <div className="truncate">{message.parent_message.content}</div>
          </div>
        )}
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className={`${
            message.sender_role === 'client' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {message.sender_role === 'client' ? 'Client' : 'Professional'}
          </Badge>
          <span className="text-xs opacity-75">{message.sender_name}</span>
        </div>
        <p className="text-sm">{message.content}</p>
        <div className="flex items-center justify-between mt-1">
          <div className="text-xs opacity-75">
            {new Date(message.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onReply(message)}
            >
              <Reply className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
