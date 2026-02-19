import { z } from 'zod';

export const incidentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['Safety', 'Maintenance']),
  status: z.enum(['Open', 'In Progress', 'Success']),
});

export type IncidentFormData = z.infer<typeof incidentSchema>;