import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { incidentSchema } from './incidentSchema';
import type { IncidentFormData } from './incidentSchema';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

interface IncidentFormProps {
  defaultValues?: IncidentFormData;
  onSubmit: (data: IncidentFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CATEGORY_OPTIONS = [
  { value: 'Safety', label: 'Safety' },
  { value: 'Maintenance', label: 'Maintenance' },
];

const STATUS_OPTIONS = [
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Success', label: 'Success' },
];

export function IncidentForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: IncidentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Title"
        {...register('title')}
        error={errors.title?.message}
        placeholder="Enter incident title"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe the incident..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <Select
        label="Category"
        {...register('category')}
        options={CATEGORY_OPTIONS}
        error={errors.category?.message}
      />

      <Select
        label="Status"
        {...register('status')}
        options={STATUS_OPTIONS}
        error={errors.status?.message}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}