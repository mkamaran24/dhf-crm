"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Save, FileText, Calendar, User, Upload, Download, Trash2, Plus } from "lucide-react";
import { Card, Button, Input, Select, Badge } from "@/src/shared/components/ui";
import { Patient } from "@/src/features/patients/types";

export default function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchPatient() {
      try {
        const res = await fetch(`/api/patients/${id}`);
        if (!res.ok) {
          throw new Error('Patient not found');
        }
        const data = await res.json();
        setPatient(data);
      } catch (error) {
        console.error('Error fetching patient:', error);
        setPatient(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPatient();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-900 font-semibold mb-2">Patient not found</p>
          <p className="text-gray-500 mb-4">The patient you're looking for doesn't exist.</p>
          <Link href="/patients">
            <Button variant="outlined">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Patients
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/patients">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{patient.firstName} {patient.lastName}</h1>
              <p className="text-sm text-gray-500">Patient ID: #{patient.id}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outlined" className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button variant="filled">
            <Calendar className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 bg-white flex border-b border-gray-200">
          {[
            { id: "profile", label: "Profile Information" },
            { id: "visits", label: "Visit History" },
            { id: "documents", label: "Documents" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
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
                    <Input label="First Name" defaultValue={patient.firstName} />
                    <Input label="Last Name" defaultValue={patient.lastName} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Email" defaultValue={patient.email} />
                    <Input label="Phone" defaultValue={patient.phone} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Date of Birth" type="date" defaultValue={patient.dob} />
                    <Select 
                      label="Gender" 
                      defaultValue={patient.gender}
                      options={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                        { label: "Other", value: "Other" },
                      ]}
                    />
                  </div>
                  <Input label="Address" defaultValue={patient.address} />
                </div>

                <div className="flex justify-end">
                   <Button type="submit" isLoading={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Visits Tab */}
          {activeTab === "visits" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button size="sm" variant="outlined">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Visit Record
                </Button>
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
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 border-transparent text-white shadow-none">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New
                </Button>
              </div>

              <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["Document Name", "Type", "Size", "Date", "Actions"].map(header => (
                        <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {patient.documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
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
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
