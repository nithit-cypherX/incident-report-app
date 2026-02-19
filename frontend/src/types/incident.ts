export type Category = 'Safety' | 'Maintenance';
export type Status = 'Open' | 'In Progress' | 'Success';

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: Status;
  created_at: string;
  updated_at: string;
}

export interface CreateIncidentDTO {
  title: string;
  description: string;
  category: Category;
  status: Status;
}

export interface UpdateIncidentDTO {
  title: string;
  description: string;
  category: Category;
  status: Status;
}