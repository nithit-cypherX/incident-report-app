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


export interface IncidentQueryParams {
  category?: string;
  status?: string;
  search?: string;
  sort_by?: 'created_at' | 'updated_at' | 'title';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}


export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}