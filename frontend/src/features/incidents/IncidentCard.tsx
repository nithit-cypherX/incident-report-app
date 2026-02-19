import type { Incident } from '../../types/incident';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../lib/utils';

interface IncidentCardProps {
  incident: Incident;
  onEdit: (incident: Incident) => void;
  onDelete: (id: string) => void;
}

export function IncidentCard({ incident, onEdit, onDelete }: IncidentCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {incident.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <Badge status={incident.status} />
            <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
              {incident.category}
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {incident.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {formatDate(incident.created_at)}
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(incident)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(incident.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}