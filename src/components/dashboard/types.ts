export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  client_id: string;
  created_at: string;
  updated_at: string;
  deadline?: string;
  category?: string;
  skills_required?: string[];
}

export interface Application {
  id: string;
  project_id: string;
  professional_id: string;
  cover_letter: string;
  proposal_message: string;
  bid_amount: number;
  availability: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  project?: {
    id: string;
    title: string;
    status: string;
    budget: number;
    created_at: string;
  };
  professional?: {
    first_name: string;
    last_name: string;
  };
}

export interface Professional {
  id: string;
  first_name?: string;
  last_name?: string;
  skills?: string[];
  rating?: number;
  account_type: 'professional';
  created_at: string;
  updated_at?: string;
}

export interface Client {
  id: string;
  first_name?: string;
  last_name?: string;
  account_type: 'client';
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  project_id: string;
  client_id: string;
  professional_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  project_id: string;
  client_id: string;
  professional_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  project?: {
    title: string;
  };
  professional?: {
    first_name: string;
    last_name: string;
  };
}
