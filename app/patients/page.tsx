"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Download } from "lucide-react";
import { Button } from "@/src/shared/components/ui";
import { Pagination } from "@/src/shared/components/ui/pagination";
import { DeleteConfirmationModal } from "@/src/shared/components/ui/delete-confirmation-modal";
import { PatientsFilters, PatientsTable } from "@/src/features/patients/components";
import { usePatients } from "@/src/features/patients/hooks/use-patients";
import { exportToExcel, exportToPDF } from "@/src/shared/lib/export";

export default function PatientsPage() {
  const {
    patients,
    isLoading,
    searchQuery,
    filters,
    pagination,
    setSearchQuery,
    setStatusFilter,
    clearFilters,
    deletePatient,
    setPage,
  } = usePatients();

  const [deleteModal, setDeleteModal] = useState<{ patientId: string; patientName: string } | null>(null);

  const handleDeleteClick = (patientId: string, patientName: string) => {
    setDeleteModal({ patientId, patientName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    
    await deletePatient(deleteModal.patientId);
    setDeleteModal(null);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    if (!patients || patients.length === 0) return;
    
    if (format === 'excel') {
      const exportData = patients.map(p => ({
        Name: `${p.firstName} ${p.lastName}`,
        Email: p.email,
        Phone: p.phone,
        Status: p.status,
        'Last Visit': p.lastVisit || 'N/A',
      }));
      exportToExcel(exportData, 'patients.xlsx', 'Patients');
    } else {
      const headers = ['Name', 'Email', 'Phone', 'Status', 'Last Visit'];
      const data = patients.map(p => [
        `${p.firstName} ${p.lastName}`,
        p.email,
        p.phone,
        p.status,
        p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : 'N/A',
      ]);
      exportToPDF('Patients Report', headers, data, 'patients.pdf');
    }
  };

  const hasActiveFilters = Boolean(searchQuery || filters.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
          <p className="text-sm text-gray-500 mt-1">Manage patient records and information</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Button variant="outlined">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => handleExport('excel')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
              >
                Export to Excel
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg"
              >
                Export to PDF
              </button>
            </div>
          </div>
          <Link href="/patients/create">
            <Button variant="filled">
              <Plus className="w-4 h-4 mr-2" />
              Add New Patient
            </Button>
          </Link>
        </div>
      </div>

      <PatientsFilters
        filters={filters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onClearFilters={clearFilters}
      />

      <PatientsTable
        patients={patients || []}
        isLoading={isLoading}
        hasActiveFilters={hasActiveFilters}
        onDelete={handleDeleteClick}
      />

      {!isLoading && patients && patients.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <Pagination
            pagination={pagination}
            onPageChange={setPage}
          />
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={!!deleteModal}
        itemName={deleteModal?.patientName || ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal(null)}
      />
    </div>
  );
}
