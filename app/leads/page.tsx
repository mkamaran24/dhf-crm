"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Download } from "lucide-react";
import { Button, Tabs, TabsList, TabsTrigger, TabsContent, Pagination, DeleteConfirmationModal } from "@/src/shared/components/ui";
import { LeadsFilters } from "@/src/features/leads/components/leads-filters";
import { LeadsTable } from "@/src/features/leads/components/leads-table";
import { useLeads } from "@/src/features/leads/hooks/use-leads";
import { PatientsFilters, PatientsTable } from "@/src/features/patients/components";
import { usePatients } from "@/src/features/patients/hooks/use-patients";
import { exportToExcel, exportToPDF } from "@/src/shared/lib/export";

function LeadsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") === "patients" ? "patients" : "leads";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "patients" || tab === "leads") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newUrl = value === "patients" ? "/leads?tab=patients" : "/leads";
    router.push(newUrl, { scroll: false });
  };

  const leadsHook = useLeads();
  const patientsHook = usePatients();

  const [deleteLeadModal, setDeleteLeadModal] = useState<{ leadId: string; leadName: string } | null>(null);
  const [deletePatientModal, setDeletePatientModal] = useState<{ patientId: string; patientName: string } | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleDeleteLeadClick = (leadId: string, leadName: string) => {
    setDeleteLeadModal({ leadId, leadName });
  };

  const handleConfirmDeleteLead = async () => {
    if (!deleteLeadModal) return;
    await leadsHook.deleteLead(deleteLeadModal.leadId);
    setDeleteLeadModal(null);
  };

  const handleDeletePatientClick = (patientId: string, patientName: string) => {
    setDeletePatientModal({ patientId, patientName });
  };

  const handleConfirmDeletePatient = async () => {
    if (!deletePatientModal) return;
    await patientsHook.deletePatient(deletePatientModal.patientId);
    setDeletePatientModal(null);
  };

  const handleExportPatients = (format: 'pdf' | 'excel') => {
    if (!patientsHook.patients || patientsHook.patients.length === 0) return;
    
    if (format === 'excel') {
      const exportData = patientsHook.patients.map(p => ({
        Name: `${p.firstName} ${p.lastName}`,
        Email: p.email,
        Phone: p.phone,
        Status: p.status,
        'Last Visit': p.lastVisit || 'N/A',
      }));
      exportToExcel(exportData, 'patients.xlsx', 'Patients');
    } else {
      const headers = ['Name', 'Email', 'Phone', 'Status', 'Last Visit'];
      const data = patientsHook.patients.map(p => [
        `${p.firstName} ${p.lastName}`,
        p.email,
        p.phone,
        p.status,
        p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : 'N/A',
      ]);
      exportToPDF('Patients Report', headers, data, 'patients.pdf');
    }
  };

  const hasActiveLeadsFilters = Boolean(leadsHook.searchQuery || leadsHook.filters.status);
  const hasActivePatientsFilters = Boolean(patientsHook.searchQuery || patientsHook.filters.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contacts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage leads and patients</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {activeTab === "patients" && (
            <div className="relative">
              <Button 
                variant="outlined" 
                onClick={() => setShowExportMenu(!showExportMenu)}
                onBlur={() => setTimeout(() => setShowExportMenu(false), 200)}
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">Export</span>
              </Button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <button
                    onClick={() => {
                      handleExportPatients('excel');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg transition-colors"
                  >
                    Export to Excel
                  </button>
                  <button
                    onClick={() => {
                      handleExportPatients('pdf');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg transition-colors"
                  >
                    Export to PDF
                  </button>
                </div>
              )}
            </div>
          )}
          {activeTab === "leads" && (
            <Link href="/leads/create">
              <Button variant="filled">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add New Lead</span>
                <span className="sm:hidden">Add Lead</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="leads" className="flex-1 px-6 sm:px-8">
            Leads
          </TabsTrigger>
          <TabsTrigger value="patients" className="flex-1 px-6 sm:px-8">
            Patients
          </TabsTrigger>
        </TabsList>

          <TabsContent value="leads" className="mt-6">
            <div className="space-y-6">
              <LeadsFilters
                filters={leadsHook.filters}
                searchQuery={leadsHook.searchQuery}
                onSearchChange={leadsHook.setSearchQuery}
                onStatusChange={leadsHook.setStatusFilter}
                onClearFilters={leadsHook.clearFilters}
              />

              <LeadsTable
                leads={leadsHook.leads}
                isLoading={leadsHook.isLoading}
                hasActiveFilters={hasActiveLeadsFilters}
                onStatusChange={leadsHook.updateLeadStatus}
                onDelete={handleDeleteLeadClick}
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
          </TabsContent>

          <TabsContent value="patients" className="mt-6">
            <div className="space-y-6">
              <PatientsFilters
                filters={patientsHook.filters}
                searchQuery={patientsHook.searchQuery}
                onSearchChange={patientsHook.setSearchQuery}
                onStatusChange={patientsHook.setStatusFilter}
                onClearFilters={patientsHook.clearFilters}
              />

              <PatientsTable
                patients={patientsHook.patients || []}
                isLoading={patientsHook.isLoading}
                hasActiveFilters={hasActivePatientsFilters}
                onDelete={handleDeletePatientClick}
              />

              {!patientsHook.isLoading && patientsHook.patients && patientsHook.patients.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200">
                  <Pagination
                    pagination={patientsHook.pagination}
                    onPageChange={patientsHook.setPage}
                  />
                </div>
              )}
            </div>
          </TabsContent>
      </Tabs>

      <DeleteConfirmationModal
        isOpen={!!deleteLeadModal}
        itemName={deleteLeadModal?.leadName || ""}
        onConfirm={handleConfirmDeleteLead}
        onCancel={() => setDeleteLeadModal(null)}
      />

      <DeleteConfirmationModal
        isOpen={!!deletePatientModal}
        itemName={deletePatientModal?.patientName || ""}
        onConfirm={handleConfirmDeletePatient}
        onCancel={() => setDeletePatientModal(null)}
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
            <h1 className="text-2xl font-bold text-gray-800">Contacts</h1>
            <p className="text-sm text-gray-500 mt-1">Manage leads and patients</p>
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
