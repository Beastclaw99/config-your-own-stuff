
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, X } from 'lucide-react';
import type { ProjectMessage } from '../types';

interface MessageInputProps {
  newMessage: string;
  replyingTo: ProjectMessage | null;
  isChatDisabled: boolean;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onCancelReply: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  replyingTo,
  isChatDisabled,
  onMessageChange,
  onSendMessage,
  onCancelReply
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isChatDisabled) {
      onSendMessage();
    }
  };

  return (
    <div className="border-t p-4">
      {replyingTo && (
        <div className="mb-2 p-2 bg-gray-100 rounded flex items-center justify-between">
          <div className="text-sm">
            Replying to <span className="font-medium">{replyingTo.sender_name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onCancelReply}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder={replyingTo ? "Write a reply..." : "Type a message..."}
          onKeyPress={handleKeyPress}
          disabled={isChatDisabled}
        />
        <Button 
          onClick={onSendMessage} 
          disabled={!newMessage.trim() || isChatDisabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
