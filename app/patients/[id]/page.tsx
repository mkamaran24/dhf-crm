"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Save, FileText, Calendar, User, Upload, Download, Trash2, Plus } from "lucide-react";
import { MaterialCard } from "@/components/MaterialCard";
import { MaterialInput } from "@/components/MaterialInput";
import { MaterialButton } from "@/components/MaterialButton";
import { MaterialSelect } from "@/components/MaterialSelect";
import { MaterialTabs } from "@/components/MaterialTabs";
import { MaterialTable } from "@/components/MaterialTable";
import { Patient } from "@/types/patient";

export default function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Mock fetch
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p: Patient) => p.id === id);
        setPatient(found || null);
        setIsLoading(false);
      });
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading patient details...</div>;
  if (!patient) return <div className="p-8 text-center text-red-500">Patient not found</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/patients">
            <MaterialButton variant="text" size="sm" className="pl-0 hover:pl-1 transition-all">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </MaterialButton>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold shadow-sm">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{patient.firstName} {patient.lastName}</h1>
              <p className="text-sm text-gray-500">Patient ID: {patient.id}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <MaterialButton variant="outlined" className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </MaterialButton>
          <MaterialButton variant="filled">
            <Calendar className="w-4 h-4 mr-2" />
            Book Appointment
          </MaterialButton>
        </div>
      </div>

      {/* Tabs */}
      <MaterialCard className="p-0 overflow-hidden">
        <div className="px-6 bg-white">
          <MaterialTabs 
            tabs={[
              { id: "profile", label: "Profile Information" },
              { id: "visits", label: "Visit History" },
              { id: "documents", label: "Documents" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <div className="p-6 bg-gray-50/30 min-h-[500px]">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="max-w-4xl">
              <form onSubmit={handleSave} className="space-y-8">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-gray-800 font-semibold border-b border-gray-100 pb-3">
                    <User className="w-5 h-5 text-blue-500" />
                    Personal Details
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MaterialInput label="First Name" defaultValue={patient.firstName} />
                    <MaterialInput label="Last Name" defaultValue={patient.lastName} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MaterialInput label="Email" defaultValue={patient.email} />
                    <MaterialInput label="Phone" defaultValue={patient.phone} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MaterialInput label="Date of Birth" type="date" defaultValue={patient.dob} />
                    <MaterialSelect 
                      label="Gender" 
                      defaultValue={patient.gender}
                      options={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                        { label: "Other", value: "Other" },
                      ]}
                    />
                  </div>
                  <MaterialInput label="Address" defaultValue={patient.address} />
                </div>

                <div className="flex justify-end">
                   <MaterialButton type="submit" isLoading={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </MaterialButton>
                </div>
              </form>
            </div>
          )}

          {/* Visits Tab */}
          {activeTab === "visits" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <MaterialButton size="sm" variant="outlined">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Visit Record
                </MaterialButton>
              </div>
              
              {patient.visits.length > 0 ? (
                <div className="space-y-4">
                  {patient.visits.map((visit) => (
                    <div key={visit.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-800">{visit.reason}</h4>
                          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(visit.date).toLocaleDateString()}
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            {visit.doctor}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
                          Completed
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                        {visit.notes}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                     <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-gray-500 font-medium">No visit history found</p>
                  <p className="text-sm text-gray-400 mt-1">Record a new visit to see it here</p>
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
             <div className="space-y-6">
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div>
                   <h4 className="font-semibold text-blue-900">Upload Documents</h4>
                   <p className="text-sm text-blue-700 mt-1">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
                </div>
                <MaterialButton size="sm" className="bg-blue-600 hover:bg-blue-700 border-transparent text-white shadow-none">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New
                </MaterialButton>
              </div>

              <MaterialTable headers={["Document Name", "Type", "Size", "Date", "Actions"]} className="bg-white">
                {patient.documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      {doc.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{doc.type}</td>
                    <td className="px-6 py-4 text-gray-600">{doc.size}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-full transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {patient.documents.length === 0 && (
                   <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No documents uploaded yet.
                    </td>
                  </tr>
                )}
              </MaterialTable>
            </div>
          )}
        </div>
      </MaterialCard>
    </div>
  );
}
