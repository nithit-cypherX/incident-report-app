import { apiClient } from '../../lib/api';
import type {
  Incident,
  CreateIncidentDTO,
  UpdateIncidentDTO,
  IncidentQueryParams,
  PaginatedResponse,
} from '../../types/incident';

export const incidentApi = {
  getAll: (params?: IncidentQueryParams) => {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== '')
        .map(([k, v]) => [k, String(v)])
    ).toString() : '';
    
    return apiClient<PaginatedResponse<Incident>>(`/incidents${queryString}`);
  },

  getById: (id: string) => 
    apiClient<Incident>(`/incidents/${id}`),

  create: (dto: CreateIncidentDTO) => 
    apiClient<Incident>('/incidents', {
      method: 'POST',
      data: dto,
    }),

  update: (id: string, dto: UpdateIncidentDTO) => 
    apiClient<Incident>(`/incidents/${id}`, {
      method: 'PUT',
      data: dto,
    }),

  delete: (id: string) => 
    apiClient<void>(`/incidents/${id}`, {
      method: 'DELETE',
    }),
};