"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Patient, Visit } from "@/src/features/patients/types";
import { cn } from "@/src/shared/lib/utils";
import { Card, Button, Input, Select, Badge } from "@/src/shared/components/ui";
import {
  ArrowLeft,
  Save,
  FileText,
  Calendar,
  User,
  Upload,
  Download,
  Trash2,
  Plus,
  History,
  Activity,
  CheckCircle,
  PenTool,
  ArrowRight,
  ClipboardList,
  Stethoscope,
  Clock
} from "lucide-react";

export default function PatientDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = useParams();
  const router = useRouter();
  const { id } = use(paramsPromise);
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
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 text-white flex items-center justify-center text-xl font-bold shadow-sm">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{patient.firstName} {patient.lastName}</h1>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase border border-blue-100 italic tracking-wider">Cardiac Patient</span>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold text-slate-500">ID: {patient.id}</p>
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <p className="text-sm font-medium text-slate-500 italic">{patient.address || 'Erbil, Iraq'}</p>
              </div>
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
              className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
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
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-xl text-slate-500">
                    <History className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">Clinical Encounter Timeline</h2>
                </div>
                <Button size="sm" variant="outlined" className="bg-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Clinical Entry
                </Button>
              </div>

              {patient.visits && patient.visits.length > 0 ? (
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent pr-4">
                  {patient.visits.map((visit, index) => (
                    <div key={visit.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      {/* Dot */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <Activity className="w-4 h-4" />
                      </div>

                      {/* Content Card */}
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
                              <Calendar className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                              <span className="text-base font-bold text-slate-800">{new Date(visit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{visit.time || "10:00 AM"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Clinical Encounter</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block italic opacity-60 px-1">Consultation Objective</label>
                          <p className="text-sm font-semibold text-slate-700 px-1 leading-relaxed">"{visit.reason}"</p>
                        </div>

                        {/* Encounter Documentation */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                          {(visit.forms || [
                            { type: "Cardiac Intake", completed: true, lastUpdate: "10:45 AM", doctor: "Dr. Ahmed Yasin" },
                            { type: "Echocardiogram", completed: true, lastUpdate: "11:15 AM", doctor: "Dr. Saud Sherwan" },
                            { type: "Prescription", completed: false, lastUpdate: "—", doctor: "Pending" }
                          ]).map((form: any) => (
                            <button
                              key={form.type}
                              onClick={() => {
                                const pathMap: any = {
                                  "Cardiac Intake": "clinical-assessment",
                                  "Echocardiogram": "treatment-plan",
                                  "Prescription": "prescription"
                                };
                                // Use a valid appointment ID for the link, or fallback to the current patient context
                                const aptId = visit.id.split('-')[1] || "100";
                                router.push(`/appointments/${aptId}/visit/${pathMap[form.type]}`);
                              }}
                              className={cn(
                                "flex flex-col gap-1.5 p-3 rounded-xl border transition-all text-left group/form",
                                form.completed
                                  ? "bg-emerald-50/20 border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50/40"
                                  : "bg-slate-50 border-slate-100 hover:border-slate-200 hover:bg-white"
                              )}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className={cn(
                                  "text-[9px] font-black uppercase tracking-wider",
                                  form.completed ? "text-emerald-700" : "text-slate-400"
                                )}>
                                  {form.type}
                                </span>
                                <div className={cn(
                                  "p-1 rounded transition-all group-hover/form:scale-110",
                                  form.completed ? "bg-white text-emerald-500" : "bg-white text-slate-300"
                                )}>
                                  {form.completed ? <CheckCircle className="w-3 h-3" /> : <PenTool className="w-3 h-3" />}
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-700 truncate">{form.doctor || "Medical Staff"}</span>
                                <span className="text-[8px] font-semibold text-slate-400 italic">
                                  {form.completed ? `Sync ${form.lastUpdate}` : "Awaiting"}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic leading-none">VIS-REF: {visit.id}</span>
                          <div className="h-1 w-1 bg-slate-200 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-gray-500 font-medium">No clinical history recorded</p>
                  <p className="text-sm text-gray-400 mt-1">Visit history will appear here once patient sessions are finalized.</p>
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
                    {patient.documents && patient.documents.map((doc) => (
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
                    {(!patient.documents || patient.documents.length === 0) && (
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
