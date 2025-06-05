
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  searchQuery: string;
  filteredMessagesCount: number;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  filteredMessagesCount,
  onSearchChange,
  onClearSearch
}) => {
  return (
    <div className="mt-4 relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={onClearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {searchQuery && (
        <div className="mt-2 text-sm text-gray-500">
          Found {filteredMessagesCount} messages
        </div>
      )}
    </div>
  );
};
