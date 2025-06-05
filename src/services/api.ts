import { supabase } from '@/lib/supabase';
import type { Project, Message } from '@/types';

export const getProject = async (projectId: string): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:profiles!projects_client_id_fkey(first_name, last_name)
    `)
    .eq('id', projectId)
    .single();

  if (error) throw error;
  return data;
};

export const applyToProject = async (projectId: string): Promise<void> => {
  const { error } = await supabase
    .from('applications')
    .insert([
      {
        project_id: projectId,
        status: 'pending'
      }
    ]);

  if (error) throw error;
};

export const sendMessage = async (projectId: string, content: string): Promise<Message> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('project_messages')
    .insert({
      project_id: projectId,
      sender_id: user.id,
      content: content.trim(),
      sent_at: new Date().toISOString()
    })
    .select(`
      *,
      sender:sender_id(
        first_name,
        last_name
      )
    `)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    project_id: data.project_id,
    sender_id: data.sender_id,
    recipient_id: data.recipient_id,
    content: data.content,
    sent_at: data.sent_at,
    sender_name: data.sender ? `${data.sender.first_name} ${data.sender.last_name}` : 'Unknown User',
    sender_role: 'professional', // This should be determined based on the user's role
    is_read: false,
    sender: data.sender
  };
};

export const getProjectMessages = async (projectId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('project_messages')
    .select(`
      *,
      sender:sender_id(
        first_name,
        last_name
      )
    `)
    .eq('project_id', projectId)
    .order('sent_at', { ascending: false });

  if (error) throw error;

  return data.map(msg => ({
    id: msg.id,
    project_id: msg.project_id,
    sender_id: msg.sender_id,
    recipient_id: msg.recipient_id,
    content: msg.content,
    sent_at: msg.sent_at,
    sender_name: msg.sender ? `${msg.sender.first_name} ${msg.sender.last_name}` : 'Unknown User',
    sender_role: 'professional', // This should be determined based on the user's role
    is_read: false,
    sender: msg.sender
  }));
}; 