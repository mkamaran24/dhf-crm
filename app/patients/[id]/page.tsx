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
  Clock,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export default function PatientDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = useParams();
  const router = useRouter();
  const { id } = use(paramsPromise);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // Handle tab from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      if (tab) setActiveTab(tab);
    }
  }, []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchPatient() {
      try {
        const res = await fetch(`/api/patients/${id}`);
        if (!res.ok) {
          throw new Error('Patient not found');
        }
        const data = await res.json();

        const enhancedData = {
          ...data,
          visits: [
            {
              id: "VIS-9281",
              date: new Date().toISOString().split('T')[0], // Today
              time: "10:30 AM",
              doctor: "Dr. Ahmed Yasin",
              reason: "Cardiac Consultation",
              forms: [
                { type: "Cardiac Intake", completed: true, lastUpdate: "10:45 AM", doctor: "Dr. Ahmed Yasin" },
                { type: "Echocardiogram", completed: true, lastUpdate: "11:00 AM", doctor: "Dr. Saud Sherwan" },
                { type: "Prescription", completed: false, lastUpdate: "—", doctor: "Pending" }
              ]
            },
            {
              id: "VIS-8542",
              date: "2023-11-28",
              time: "02:15 PM",
              doctor: "Dr. Karwan Mustafa",
              reason: "Follow-up - Chest Pain",
              forms: [
                { type: "Cardiac Intake", completed: true, lastUpdate: "02:30 PM", doctor: "Dr. Karwan Mustafa" },
                { type: "Echocardiogram", completed: true, lastUpdate: "02:45 PM", doctor: "Dr. Karwan Mustafa" },
                { type: "Prescription", completed: true, lastUpdate: "03:00 PM", doctor: "Dr. Karwan Mustafa" }
              ]
            }
          ]
        };
        setPatient(enhancedData);
      } catch (error) {
        console.error('Error fetching patient:', error);
        setPatient({
          id: id,
          firstName: "Muslih",
          lastName: "Hamad",
          email: "muslih@example.com",
          phone: "+964 750 123 4567",
          dob: "1960-05-15",
          gender: "Male",
          address: "Karrada, Baghdad, Iraq",
          status: "Active",
          appointmentDate: new Date().toISOString().split('T')[0],
          appointmentStatus: 'confirmed',
          activeAppointmentId: "APT-9281",
          createdAt: new Date().toISOString(),
          visits: [
            {
              id: "VIS-9281",
              date: new Date().toISOString().split('T')[0],
              time: "10:30 AM",
              doctor: "Dr. Ahmed Yasin",
              reason: "Cardiac Consultation",
              forms: [
                { type: "Cardiac Intake", completed: true, lastUpdate: "10:45 AM", doctor: "Dr. Ahmed Yasin" },
                { type: "Echocardiogram", completed: true, lastUpdate: "11:00 AM", doctor: "Dr. Saud Sherwan" },
                { type: "Prescription", completed: false, lastUpdate: "—", doctor: "Pending" }
              ]
            }
          ]
        } as any);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPatient();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading medical record...</p>
        </div>
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <Link href="/patients">
            <button className="p-2.5 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all border border-slate-200 shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 text-white flex items-center justify-center text-xl font-bold shadow-md">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{patient.firstName} {patient.lastName}</h1>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase border border-indigo-100 italic tracking-wider">Cardiac Specialized</span>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold text-slate-500">Medical ID: {patient.id}</p>
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <p className="text-sm font-medium text-slate-500 italic">{patient.address || 'Karrada, Baghdad, Iraq'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="filled" className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-6 rounded-lg font-semibold">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Visit
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Card className="p-0 overflow-hidden border-slate-200 shadow-sm rounded-xl">
        <div className="px-6 bg-white flex border-b border-slate-200">
          {[
            { id: "profile", label: "Patient Profile" },
            { id: "visits", label: "Clinical Visits" },
            { id: "documents", label: "Medical Files" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-semibold transition-all relative ${activeTab === tab.id
                ? 'text-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />}
            </button>
          ))}
        </div>

        <div className="p-8 bg-slate-50/20 min-h-[500px]">
          {activeTab === "profile" && (
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSave} className="space-y-8">
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-8">
                  <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-4">
                    <User className="w-5 h-5 text-indigo-600" />
                    Personal & Contact Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input label="First Name" defaultValue={patient.firstName} className="h-11" />
                    <Input label="Last Name" defaultValue={patient.lastName} className="h-11" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input label="Email Address" defaultValue={patient.email} className="h-11" />
                    <Input label="Contact Number" defaultValue={patient.phone} className="h-11" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input label="Date of Birth" type="date" defaultValue={patient.dob} className="h-11" />
                    <Select
                      label="Biological Gender"
                      defaultValue={patient.gender}
                      options={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                      ]}
                      className="h-11"
                    />
                  </div>
                  <Input label="Residential Address" defaultValue={patient.address} className="h-11" />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" isLoading={isSaving} className="h-11 px-8 rounded-lg font-bold bg-slate-900 text-white hover:bg-slate-800">
                    <Save className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "visits" && (
            <div className="space-y-12">
              {(() => {
                const todayVisit = patient.visits?.find(v => v.date === new Date().toISOString().split('T')[0]);
                const isConfirmed = patient.appointmentStatus === 'confirmed';

                if (!todayVisit) return null;

                if (!isConfirmed) {
                  return (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-900">Encounter Initialization Blocked</h3>
                        <p className="text-sm text-slate-500 max-w-sm mx-auto">This patient is currently marked as <span className="font-bold text-slate-900 uppercase">"{patient.appointmentStatus}"</span>. Clinical encounters can only be initialized for confirmed appointments.</p>
                      </div>
                      <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-8 rounded-lg font-semibold shadow-md">
                        Confirm Appointment Status
                      </Button>
                    </div>
                  );
                }

                const sessionForms = todayVisit.forms || [];
                const completedCount = sessionForms.filter(f => f.completed).length;
                const totalCount = sessionForms.length;
                const progressPercent = (completedCount / totalCount) * 100;
                const isSessionComplete = completedCount === totalCount;

                return (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Clinical Encounter</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest animate-pulse">Session Active</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-slate-50">
                        <div
                          className="h-full bg-indigo-600 transition-all duration-1000 ease-in-out"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-all",
                          isSessionComplete ? "bg-emerald-600 text-white" : "bg-indigo-600 text-white"
                        )}>
                          {isSessionComplete ? <ShieldCheck className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Encounter Completion</h2>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
                              {completedCount} OF {totalCount} REPORTS FINALIZED
                            </span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-widest",
                              isSessionComplete ? "text-emerald-600" : "text-indigo-600 animate-pulse"
                            )}>
                              {isSessionComplete ? "RECORD READY" : "INPUT PENDING"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {sessionForms.map((form: any) => (
                          <div
                            key={form.type}
                            className={cn(
                              "px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all flex items-center gap-2",
                              form.completed
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-slate-50 text-slate-400 border-slate-100"
                            )}
                          >
                            {form.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                            {form.type}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {sessionForms.map((form: any) => {
                        const iconMap: any = { "Cardiac Intake": ClipboardList, "Echocardiogram": Activity, "Prescription": FileText };
                        const Icon = iconMap[form.type];
                        return (
                          <VisitActionCard
                            key={form.type}
                            title={form.type}
                            description={
                              form.type === "Cardiac Intake" ? "Medical history & cardiovascular risk factors." :
                                form.type === "Echocardiogram" ? "Ventricular measurements & valve documentation." :
                                  "Clinical medications & dosage guidelines."
                            }
                            icon={Icon}
                            doctor={form.doctor}
                            isCompleted={form.completed}
                            onClick={() => router.push(`/appointments/${id}/visit/${form.type === "Cardiac Intake" ? "clinical-assessment" : form.type === "Echocardiogram" ? "treatment-plan" : "prescription"}`)}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-xl text-white shadow-sm">
                      <History className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Historical Medical Records</h2>
                  </div>
                  <Button size="sm" variant="outlined" className="bg-white border-slate-200 text-slate-600 font-bold px-4 h-9 rounded-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Add External Record
                  </Button>
                </div>

                {patient.visits && patient.visits.length > 0 ? (
                  <div className="space-y-4">
                    {[...patient.visits]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((visit) => (
                        <div key={visit.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:border-indigo-200 transition-all">
                          <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x border-slate-100">
                            <div className="p-6 lg:w-[280px] bg-slate-50/40">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm font-bold">
                                  <Calendar className="w-4 h-4 text-slate-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{new Date(visit.date).toLocaleDateString()}</p>
                                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{visit.time || "Scheduled"}</p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Clinical Motive</label>
                                  <p className="text-xs font-semibold text-slate-600 italic">"{visit.reason}"</p>
                                </div>
                                <div className="px-3 py-1 bg-white border border-slate-100 rounded-md w-max shadow-sm flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Validated Entry</span>
                                </div>
                              </div>
                            </div>

                            <div className="p-6 flex-1">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {(visit.forms || []).map((form: any) => (
                                  <button
                                    key={form.type}
                                    onClick={() => {
                                      const pathMap: any = {
                                        "Cardiac Intake": "clinical-assessment",
                                        "Echocardiogram": "treatment-plan",
                                        "Prescription": "prescription"
                                      };
                                      router.push(`/appointments/${id}/visit/${pathMap[form.type]}`);
                                    }}
                                    className={cn(
                                      "flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                                      form.completed
                                        ? "bg-emerald-50/20 border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50/40"
                                        : "bg-slate-50 border-slate-100 hover:border-slate-200 hover:bg-white"
                                    )}
                                  >
                                    <div className={cn(
                                      "w-8 h-8 rounded-lg flex items-center justify-center border transition-all",
                                      form.completed ? "bg-white border-emerald-100 text-emerald-600" : "bg-white border-slate-200 text-slate-400"
                                    )}>
                                      {form.completed ? <CheckCircle className="w-4 h-4" /> : <PenTool className="w-4 h-4" />}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-[10px] font-bold text-slate-700 truncate">{form.type}</span>
                                      <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-tighter truncate">
                                        {form.doctor}
                                      </span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                              <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Stethoscope className="w-3 h-3 text-slate-300" />
                                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">Registered by {visit.doctor}</span>
                                </div>
                                <span className="text-[9px] font-bold text-slate-200 uppercase tracking-widest leading-none">REF: {visit.id}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-inner">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-slate-600 font-bold">No historical data found</p>
                    <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">Clinical visit history will appear here once encounters are finalized by the medical team.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-indigo-50/50 p-6 rounded-xl border border-indigo-100 shadow-sm">
                <div>
                  <h4 className="font-bold text-indigo-900">Patient Document Storage</h4>
                  <p className="text-xs text-indigo-700 mt-1 font-medium">Cloud secured storage for medical imaging and referral letters (Max 10MB per file)</p>
                </div>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md font-bold h-10 px-6 rounded-lg">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>

              <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {["Document Name", "Classification", "Storage Size", "Archived Date", "Controls"].map(header => (
                        <th key={header} className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patient.documents && patient.documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                          <div className="p-2 bg-slate-50 rounded border border-slate-100">
                            <FileText className="w-4 h-4 text-slate-400" />
                          </div>
                          {doc.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{doc.type}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-sm font-medium">{doc.size}</td>
                        <td className="px-6 py-4 text-slate-500 text-sm font-medium">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-full transition-all">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!patient.documents || patient.documents.length === 0) && (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center text-slate-400 italic text-sm">
                          No digital documents currently archived for this patient.
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

function VisitActionCard({ title, description, icon: Icon, onClick, isCompleted, doctor }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group p-6 rounded-xl border shadow-sm transition-all text-left flex flex-col h-full relative overflow-hidden",
        isCompleted
          ? "bg-slate-50/50 border-emerald-100"
          : "bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md shadow-indigo-200/20"
      )}
    >
      {isCompleted && (
        <div className="absolute top-4 right-4 animate-in zoom-in fade-in duration-500">
          <div className="bg-emerald-500 text-white p-1 rounded-full border border-white shadow-sm">
            <CheckCircle2 className="w-3 h-3" />
          </div>
        </div>
      )}

      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center border transition-all mb-5",
        isCompleted
          ? "bg-white border-emerald-100 text-emerald-600"
          : "bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600"
      )}>
        <Icon className="w-5 h-5 flex-shrink-0" />
      </div>

      <div className="space-y-1 flex-1">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5 leading-none">
            {isCompleted ? "VALIDATED BY" : "ASSIGNED TO"}
          </span>
          <span className={cn(
            "text-xs font-semibold truncate mt-0.5",
            isCompleted ? "text-slate-900" : "text-slate-400"
          )}>
            {doctor || "Selecting Specialist..."}
          </span>
        </div>
        <h3 className="text-base font-bold tracking-tight text-slate-900 mt-4 tracking-tight">{title}</h3>
        <p className="text-[11px] font-medium leading-relaxed text-slate-500 line-clamp-2">{description}</p>
      </div>

      <div className={cn(
        "mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
        isCompleted ? "text-emerald-600" : "text-slate-400 group-hover:text-indigo-600"
      )}>
        {isCompleted ? "Review Results" : "Begin Documentation"}
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </button>
  );
}
