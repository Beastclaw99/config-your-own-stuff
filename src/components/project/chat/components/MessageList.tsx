
import React, { useRef, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { MessageBubble } from './MessageBubble';
import type { ProjectMessage } from '../types';

interface MessageListProps {
  messages: ProjectMessage[];
  currentUserId?: string;
  onReply: (message: ProjectMessage) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  onReply
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwnMessage={message.sender_id === currentUserId}
          onReply={onReply}
        />
      ))}
      <div ref={messagesEndRef} />
    </CardContent>
  );
};
