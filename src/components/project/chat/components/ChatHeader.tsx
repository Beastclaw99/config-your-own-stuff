
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { SearchInput } from './SearchInput';

interface ChatHeaderProps {
  unreadCount: number;
  isChatDisabled: boolean;
  projectStatus: string;
  searchQuery: string;
  filteredMessagesCount: number;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  unreadCount,
  isChatDisabled,
  projectStatus,
  searchQuery,
  filteredMessagesCount,
  onSearchChange,
  onClearSearch
}) => {
  return (
    <CardHeader className="border-b">
      <div className="flex items-center justify-between">
        <CardTitle>Project Chat</CardTitle>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="ml-2">
            {unreadCount} unread
          </Badge>
        )}
      </div>
      {isChatDisabled && (
        <Badge variant="secondary" className="mt-2">
          Chat disabled - Project {projectStatus}
        </Badge>
      )}
      <SearchInput
        searchQuery={searchQuery}
        filteredMessagesCount={filteredMessagesCount}
        onSearchChange={onSearchChange}
        onClearSearch={onClearSearch}
      />
    </CardHeader>
  );
};
