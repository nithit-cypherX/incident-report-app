import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentService } from './incidentService';
import type { CreateIncidentDTO, UpdateIncidentDTO } from '../../types/incident';
import toast from 'react-hot-toast';

const INCIDENTS_KEY = ['incidents'] as const;

export function useIncidents() {
  return useQuery({
    queryKey: INCIDENTS_KEY,
    queryFn: incidentService.getAll,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateIncidentDTO) => incidentService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INCIDENTS_KEY });
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
      incidentService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INCIDENTS_KEY });
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
    mutationFn: (id: string) => incidentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INCIDENTS_KEY });
      toast.success('Incident deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}