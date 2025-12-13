"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/src/shared/components/ui";
import { Pagination } from "@/src/shared/components/ui/pagination";
import { DeleteConfirmationModal } from "@/src/shared/components/ui/delete-confirmation-modal";
import { LeadsFilters } from "@/src/features/leads/components/leads-filters";
import { LeadsTable } from "@/src/features/leads/components/leads-table";
import { useLeads } from "@/src/features/leads/hooks/use-leads";

export default function LeadsPage() {
  const {
    leads,
    isLoading,
    searchQuery,
    filters,
    pagination,
    setSearchQuery,
    setStatusFilter,
    setSourceFilter,
    clearFilters,
    updateLeadStatus,
    deleteLead,
    setPage,
  } = useLeads();

  const [deleteModal, setDeleteModal] = useState<{ leadId: string; leadName: string } | null>(null);

  const handleDeleteClick = (leadId: string, leadName: string) => {
    setDeleteModal({ leadId, leadName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    
    await deleteLead(deleteModal.leadId);
    setDeleteModal(null);
  };

  const hasActiveFilters = Boolean(searchQuery || filters.status || filters.source);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all your leads</p>
        </div>
        <Link href="/leads/create">
          <Button variant="filled">
            <Plus className="w-4 h-4 mr-2" />
            Add New Lead
          </Button>
        </Link>
      </div>

      <LeadsFilters
        filters={filters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onSourceChange={setSourceFilter}
        onClearFilters={clearFilters}
      />

      <LeadsTable
        leads={leads}
        isLoading={isLoading}
        hasActiveFilters={hasActiveFilters}
        onStatusChange={updateLeadStatus}
        onDelete={handleDeleteClick}
      />

      {!isLoading && leads.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <Pagination
            pagination={pagination}
            onPageChange={setPage}
          />
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={!!deleteModal}
        itemName={deleteModal?.leadName || ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal(null)}
      />
    </div>
  );
}
