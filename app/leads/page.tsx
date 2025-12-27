"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button, Pagination, DeleteConfirmationModal } from "@/src/shared/components/ui";
import { LeadsFilters } from "@/src/features/leads/components/leads-filters";
import { LeadsTable } from "@/src/features/leads/components/leads-table";
import { useLeads } from "@/src/features/leads/hooks/use-leads";

function LeadsPageContent() {
  const leadsHook = useLeads();
  const [deleteLeadModal, setDeleteLeadModal] = useState<{ leadId: string; leadName: string } | null>(null);

  const handleDeleteLeadClick = (leadId: string, leadName: string) => {
    setDeleteLeadModal({ leadId, leadName });
  };

  const handleConfirmDeleteLead = async () => {
    if (!deleteLeadModal) return;
    await leadsHook.deleteLead(deleteLeadModal.leadId);
    setDeleteLeadModal(null);
  };

  const hasActiveLeadsFilters = Boolean(leadsHook.searchQuery || leadsHook.filters.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your leads</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link href="/leads/create">
            <Button variant="filled">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add New Lead</span>
              <span className="sm:hidden">Add Lead</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <LeadsFilters
          filters={leadsHook.filters}
          searchQuery={leadsHook.searchQuery}
          onSearchChange={leadsHook.setSearchQuery}
          onStatusChange={leadsHook.setStatusFilter}
          onDateRangeChange={leadsHook.setDateRangeFilter}
          onClearFilters={leadsHook.clearFilters}
        />

        <LeadsTable
          leads={leadsHook.leads}
          isLoading={leadsHook.isLoading}
          hasActiveFilters={hasActiveLeadsFilters}
          onStatusChange={leadsHook.updateLeadStatus}
          onDelete={handleDeleteLeadClick}
          currentStatusFilter={leadsHook.filters.status}
        />

        {!leadsHook.isLoading && leadsHook.leads.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200">
            <Pagination
              pagination={leadsHook.pagination}
              onPageChange={leadsHook.setPage}
            />
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={!!deleteLeadModal}
        itemName={deleteLeadModal?.leadName || ""}
        onConfirm={handleConfirmDeleteLead}
        onCancel={() => setDeleteLeadModal(null)}
      />
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your leads</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    }>
      <LeadsPageContent />
    </Suspense>
  );
}
