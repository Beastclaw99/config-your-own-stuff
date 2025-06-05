import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bell, Search, X, Reply, Smile } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Reaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
  };
}

interface ProjectMessage {
  id: string;
  project_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  sent_at: string;
  sender_name: string;
  sender_role: 'client' | 'professional';
  is_read: boolean;
  parent_id?: string;
  parent_message?: ProjectMessage;
  reactions?: Reaction[];
  sender?: {
    first_name: string;
    last_name: string;
  };
}

interface ProjectChatProps {
  projectId: string;
  projectStatus: string;
  clientId: string;
  professionalId: string;
}

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '👏', '🎉', '🔥'];

const ProjectChat: React.FC<ProjectChatProps> = ({
  projectId,
  projectStatus,
  clientId,
  professionalId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ProjectMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState<ProjectMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isChatDisabled = ['completed', 'archived', 'disputed'].includes(projectStatus);
  const userRole = user?.id === clientId ? 'client' : 'professional';

  useEffect(() => {
    if (projectId) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [projectId]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = messages.filter(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.sender_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages);
    }
  }, [searchQuery, messages]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('project_messages')
        .select(`
          id,
          project_id,
          sender_id,
          recipient_id,
          content,
          sent_at,
          sender:sender_id(
            first_name,
            last_name
          )
        `)
        .eq('project_id', projectId)
        .order('sent_at', { ascending: true });

      if (error) throw error;

      const formattedMessages: ProjectMessage[] = (data || []).map(msg => {
        // Properly type check the sender object
        const senderData = msg.sender as any;
        const hasSenderData = senderData && 
          typeof senderData === 'object' && 
          'first_name' in senderData && 
          'last_name' in senderData &&
          senderData.first_name && 
          senderData.last_name;
        
        return {
          id: msg.id,
          project_id: msg.project_id,
          sender_id: msg.sender_id,
          recipient_id: msg.recipient_id,
          content: msg.content,
          sent_at: msg.sent_at,
          is_read: true, // Simplified for now
          sender_name: hasSenderData
            ? `${senderData.first_name} ${senderData.last_name}` 
            : 'Unknown User',
          sender_role: msg.sender_id === clientId ? 'client' : 'professional' as const,
          reactions: []
        };
      });

      setMessages(formattedMessages);
      setFilteredMessages(formattedMessages);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel(`project_messages:${projectId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'project_messages',
        filter: `project_id=eq.${projectId}`
      }, async (payload) => {
        // Refetch messages to get complete data with sender info
        await fetchMessages();
        scrollToBottom();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('project_messages')
        .insert({
          project_id: projectId,
          sender_id: user.id,
          recipient_id: user.id === clientId ? professionalId : clientId,
          content: newMessage.trim(),
          sent_at: new Date().toISOString()
        });

      if (error) throw error;

      setNewMessage('');
      setReplyingTo(null);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
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
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin w-8 h-8 border-4 border-ttc-blue-700 border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
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
        <div className="mt-4 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-gray-500">
              Found {filteredMessages.length} messages
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {(searchQuery ? filteredMessages : messages).map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${
              message.sender_id === user?.id ? 'bg-ttc-blue-700 text-white' : 'bg-gray-100'
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
                    onClick={() => handleReply(message)}
                  >
                    <Reply className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>

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
              onClick={cancelReply}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={replyingTo ? "Write a reply..." : "Type a message..."}
            onKeyPress={(e) => e.key === 'Enter' && !isChatDisabled && sendMessage()}
            disabled={isChatDisabled}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || isChatDisabled}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProjectChat;
