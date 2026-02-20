import { useState, useMemo } from 'react';
import type { Incident, IncidentQueryParams } from '../../types/incident';
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
import { useDebounce } from '../../hooks/useDebounce'; // ← NEW IMPORT

export function IncidentList() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Query parameters state
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<'created_at' | 'updated_at' | 'title'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ← DEBOUNCE THE SEARCH (only triggers API after 500ms of no typing)
  const debouncedSearch = useDebounce(search, 500);

  // Build query params - use debouncedSearch instead of search
  const queryParams: IncidentQueryParams = useMemo(() => ({
    search: debouncedSearch || undefined, // ← Changed from `search` to `debouncedSearch`
    category: filterCategory || undefined,
    status: filterStatus || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
    page,
    page_size: pageSize,
  }), [debouncedSearch, filterCategory, filterStatus, sortBy, sortOrder, page, pageSize]);
  // ↑ Also update dependency array

  const { data, isLoading } = useIncidents(queryParams);
  const createMutation = useCreateIncident();
  const updateMutation = useUpdateIncident();
  const deleteMutation = useDeleteIncident();

  const incidents = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.total_pages || 0;

  const handleCreate = (formData: IncidentFormData) => {
    createMutation.mutate(formData, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const handleUpdate = (formData: IncidentFormData) => {
    if (!editingIncident) return;
    updateMutation.mutate(
      { id: editingIncident.id, dto: formData },
      { onSuccess: () => setEditingIncident(null) }
    );
  };

  const handleDelete = () => {
    if (!deletingId) return;
    deleteMutation.mutate(deletingId, {
      onSuccess: () => setDeletingId(null),
    });
  };

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
                {total} total incidents
              </p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              + New Incident
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search - Keep onChange as is, but API uses debounced value */}
            <input
              type="text"
              placeholder="Search incidents..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset to page 1 on search
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Safety">Safety</option>
              <option value="Maintenance">Maintenance</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Success">Success</option>
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy as 'created_at' | 'updated_at' | 'title');
                setSortOrder(newSortOrder as 'asc' | 'desc');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="updated_at-desc">Recently Updated</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        </div>

        {/* List */}
        {incidents.length === 0 ? (
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {incidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onEdit={setEditingIncident}
                  onDelete={setDeletingId}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} results
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Modals */}
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
