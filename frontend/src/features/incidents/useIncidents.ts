import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentApi } from './incidentService';
import type { CreateIncidentDTO, UpdateIncidentDTO, IncidentQueryParams } from '../../types/incident';
import toast from 'react-hot-toast';

const INCIDENTS_KEY = 'incidents';

export function useIncidents(params?: IncidentQueryParams) {
  return useQuery({
    queryKey: [INCIDENTS_KEY, params],
    queryFn: () => incidentApi.getAll(params),
    staleTime: 30 * 1000,
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dto: CreateIncidentDTO) => incidentApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INCIDENTS_KEY] });
      toast.success('Incident created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateIncident() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateIncidentDTO }) => 
      incidentApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INCIDENTS_KEY] });
      toast.success('Incident updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteIncident() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => incidentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INCIDENTS_KEY] });
      toast.success('Incident deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}