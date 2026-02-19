import { apiClient } from '../../lib/api';
import type { Incident, CreateIncidentDTO, UpdateIncidentDTO } from '../../types/incident';

export const incidentService = {
  getAll: () =>
    apiClient<Incident[]>('/incidents'),

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