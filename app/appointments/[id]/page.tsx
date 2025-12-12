
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { MaterialCard } from "@/components/MaterialCard";
import { MaterialButton } from "@/components/MaterialButton";
import { ChevronLeft, Save, Trash2, Loader2, Calendar } from "lucide-react";
import Link from "next/link";
import { Appointment } from "@/lib/data";

const DOCTORS = ["Dr. Smith", "Dr. Jones", "Dr. Emily Brown"];
const APPOINTMENT_TYPES = ["Check-up", "Consultation", "Follow-up", "Emergency", "Teeth Cleaning", "Root Canal"];

export default function AppointmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState<Partial<Appointment>>({
    patientName: "",
    doctor: DOCTORS[0],
    type: APPOINTMENT_TYPES[0],
    notes: ""
  });
  const [datePart, setDatePart] = useState("");
  const [timePart, setTimePart] = useState("");

  useEffect(() => {
    async function fetchAppointment() {
      try {
        const res = await fetch(`/api/appointments/${unwrappedParams.id}`);
        if (!res.ok) {
           router.push('/appointments');
           return;
        }
        const data = await res.json();
        
        const dateObj = new Date(data.date);
        setDatePart(dateObj.toISOString().split('T')[0]);
        setTimePart(dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
        
        setFormData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointment();
  }, [unwrappedParams.id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const dateTime = new Date(`${datePart}T${timePart}`);

    try {
      const res = await fetch(`/api/appointments/${unwrappedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: dateTime.toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to update");
      router.push("/appointments");
    } catch (err) {
      console.error(err);
      alert("Failed to update appointment");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/appointments/${unwrappedParams.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/appointments");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel appointment");
    } finally {
      setDeleting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) {
     return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/appointments">
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-900">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Appointment Details</h1>
            <p className="text-gray-500 text-sm">View or edit appointment information</p>
          </div>
        </div>

        <MaterialCard elevation="sm" className="border-0 shadow-lg shadow-gray-200/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <form onSubmit={handleUpdate} className="space-y-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Patient Name</label>
                <input
                  type="text"
                  name="patientName"
                  required
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm"
                />
              </div>

              {/* Doctor */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Doctor</label>
                <div className="relative">
                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleChange}
                    className="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm appearance-none cursor-pointer"
                  >
                    {DOCTORS.map(doc => <option key={doc} value={doc}>{doc}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Date</label>
                <input
                  type="date"
                  value={datePart}
                  onChange={(e) => setDatePart(e.target.value)}
                  required
                  className="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm"
                />
              </div>

              {/* Time */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Time</label>
                <input
                  type="time"
                  value={timePart}
                  onChange={(e) => setTimePart(e.target.value)}
                  required
                  className="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm"
                />
              </div>

              {/* Type */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Appointment Type</label>
                <div className="relative">
                   <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm appearance-none cursor-pointer"
                  >
                    {APPOINTMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Notes</label>
                <textarea
                  name="notes"
                  rows={4}
                  value={formData.notes || ""}
                  onChange={handleChange}
                  className="w-full p-4 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <MaterialButton 
                type="button" 
                variant="text" 
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-600 hover:bg-red-50 px-4 hover:shadow-none bg-transparent border-transparent"
              >
                 {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                 Cancel Appointment
              </MaterialButton>

              <div className="flex items-center gap-3">
                 <Link href="/appointments">
                  <MaterialButton type="button" variant="outlined">
                    Back
                  </MaterialButton>
                </Link>
                <MaterialButton 
                    type="submit" 
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </MaterialButton>
              </div>
            </div>
          </form>
        </MaterialCard>
      </div>
    </div>
  );
}
