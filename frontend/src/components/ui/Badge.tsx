import { cn } from '../../lib/utils';
import type { Status } from '../../types/incident';

interface BadgeProps {
  status: Status;
}

export function Badge({ status }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-yellow-100 text-yellow-800': status === 'Open',
          'bg-blue-100 text-blue-800': status === 'In Progress',
          'bg-green-100 text-green-800': status === 'Success',
        }
      )}
    >
      {status}
    </span>
  );
}