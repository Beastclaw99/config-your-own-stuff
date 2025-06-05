
export interface Reaction {
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

export interface ProjectMessage {
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

export interface ProjectChatProps {
  projectId: string;
  projectStatus: string;
  clientId: string;
  professionalId: string;
}

export const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '👏', '🎉', '🔥'];
