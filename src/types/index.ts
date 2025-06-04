export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number | null;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  client_id: string;
}

export interface Application {
  id: string;
  project_id: string;
  freelancer_id: string;
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
} 