
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useChatMessages } from './chat/hooks/useChatMessages';
import { useChatSearch } from './chat/hooks/useChatSearch';
import { ChatHeader } from './chat/components/ChatHeader';
import { MessageList } from './chat/components/MessageList';
import { MessageInput } from './chat/components/MessageInput';
import type { ProjectChatProps, ProjectMessage } from './chat/types';

const ProjectChat: React.FC<ProjectChatProps> = ({
  projectId,
  projectStatus,
  clientId,
  professionalId
}) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount] = useState(0);
  const [replyingTo, setReplyingTo] = useState<ProjectMessage | null>(null);

  const { messages, isLoading, sendMessage } = useChatMessages(projectId, clientId);
  const { searchQuery, setSearchQuery, filteredMessages, clearSearch } = useChatSearch(messages);

  const isChatDisabled = ['completed', 'archived', 'disputed'].includes(projectStatus);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    await sendMessage(newMessage, replyingTo || undefined);
    setNewMessage('');
    setReplyingTo(null);
  };

  const handleReply = (message: ProjectMessage) => {
    setReplyingTo(message);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex justify-center items-center h-40 p-6">
          <div className="animate-spin w-8 h-8 border-4 border-ttc-blue-700 border-t-transparent rounded-full"></div>
        </div>
      </Card>
    );
  }

  const displayMessages = searchQuery ? filteredMessages : messages;

  return (
    <Card className="h-[600px] flex flex-col">
      <ChatHeader
        unreadCount={unreadCount}
        isChatDisabled={isChatDisabled}
        projectStatus={projectStatus}
        searchQuery={searchQuery}
        filteredMessagesCount={filteredMessages.length}
        onSearchChange={setSearchQuery}
        onClearSearch={clearSearch}
      />

      <MessageList
        messages={displayMessages}
        currentUserId={user?.id}
        onReply={handleReply}
      />

      <MessageInput
        newMessage={newMessage}
        replyingTo={replyingTo}
        isChatDisabled={isChatDisabled}
        onMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        onCancelReply={cancelReply}
      />
    </Card>
  );
};

export default ProjectChat;
