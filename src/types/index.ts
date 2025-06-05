export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'freelancer';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  deadline: string;
  status: 'open' | 'in_progress' | 'completed';
  clientId: string;
  clientName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
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
  parent_message?: Message;
  reactions?: Array<{
    id: string;
    type: string;
    user_id: string;
  }>;
  sender?: {
    first_name: string;
    last_name: string;
  };
} 