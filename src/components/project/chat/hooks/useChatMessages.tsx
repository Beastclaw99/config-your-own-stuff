
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ProjectMessage } from '../types';

export const useChatMessages = (projectId: string, clientId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        const sender = msg.sender && typeof msg.sender === 'object' && 'first_name' in msg.sender && 'last_name' in msg.sender
          ? msg.sender
          : null;
        
        return {
          id: msg.id,
          project_id: msg.project_id,
          sender_id: msg.sender_id,
          recipient_id: msg.recipient_id,
          content: msg.content,
          sent_at: msg.sent_at,
          is_read: true,
          sender_name: sender
            ? `${sender.first_name} ${sender.last_name}` 
            : 'Unknown User',
          sender_role: msg.sender_id === clientId ? 'client' : 'professional' as const,
          reactions: []
        };
      });

      setMessages(formattedMessages);
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
      }, async () => {
        await fetchMessages();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async (content: string, replyingTo?: ProjectMessage) => {
    if (!content.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('project_messages')
        .insert({
          project_id: projectId,
          sender_id: user.id,
          recipient_id: user.id === clientId ? 
            (messages.find(m => m.sender_id !== user.id)?.sender_id || '') : 
            clientId,
          content: content.trim(),
          sent_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchMessages();
      const unsubscribe = subscribeToMessages();
      return unsubscribe;
    }
  }, [projectId]);

  return {
    messages,
    isLoading,
    sendMessage,
    fetchMessages
  };
};
