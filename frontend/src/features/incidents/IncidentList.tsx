import { useState } from 'react';
import  type { Incident } from '../../types/incident';
import { IncidentCard } from './IncidentCard';
import { IncidentForm } from './IncidentForm';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import {
  useIncidents,
  useCreateIncident,
  useUpdateIncident,
  useDeleteIncident
} from './useIncidents';
import type { IncidentFormData } from './incidentSchema';

export function IncidentList() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const { data: incidents = [], isLoading } = useIncidents();
  const createMutation = useCreateIncident();
  const updateMutation = useUpdateIncident();
  const deleteMutation = useDeleteIncident();

  const handleCreate = (data: IncidentFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const handleUpdate = (data: IncidentFormData) => {
    if (!editingIncident) return;
    updateMutation.mutate(
      { id: editingIncident.id, dto: data },
      { onSuccess: () => setEditingIncident(null) }
    );
  };

  const handleDelete = () => {
    if (!deletingId) return;
    deleteMutation.mutate(deletingId, {
      onSuccess: () => setDeletingId(null),
    });
  };

  const filteredIncidents = incidents.filter((incident) => {
    if (filterCategory && incident.category !== filterCategory) return false;
    if (filterStatus && incident.status !== filterStatus) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading incidents...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Incident Reports</h1>
              <p className="text-gray-600 mt-1">
                Manage and track safety and maintenance incidents
              </p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              + New Incident
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Safety">Safety</option>
              <option value="Maintenance">Maintenance</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Success">Success</option>
            </select>
          </div>
        </div>

        {/* List */}
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No incidents found</p>
            <Button
              variant="secondary"
              onClick={() => setIsCreateOpen(true)}
              className="mt-4"
            >
              Create your first incident
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIncidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onEdit={setEditingIncident}
                onDelete={setDeletingId}
              />
            ))}
          </div>
        )}

        {/* Create Modal */}
        <Modal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Create New Incident"
        >
          <IncidentForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
            isSubmitting={createMutation.isPending}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={!!editingIncident}
          onClose={() => setEditingIncident(null)}
          title="Edit Incident"
        >
          {editingIncident && (
            <IncidentForm
              defaultValues={{
                title: editingIncident.title,
                description: editingIncident.description,
                category: editingIncident.category,
                status: editingIncident.status,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingIncident(null)}
              isSubmitting={updateMutation.isPending}
            />
          )}
        </Modal>

        {/* Delete Confirmation */}
        <DeleteConfirmDialog
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={handleDelete}
          isDeleting={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}