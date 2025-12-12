
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialCard } from "@/components/MaterialCard";
import { MaterialButton } from "@/components/MaterialButton";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

const DOCTORS = ["Dr. Smith", "Dr. Jones", "Dr. Emily Brown"];
const APPOINTMENT_TYPES = ["Check-up", "Consultation", "Follow-up", "Emergency", "Teeth Cleaning", "Root Canal"];

export default function CreateAppointmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    doctor: DOCTORS[0],
    date: "",
    time: "",
    type: APPOINTMENT_TYPES[0],
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Combine date and time
    const dateTime = new Date(`${formData.date}T${formData.time}`);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: formData.patientName,
          doctor: formData.doctor,
          date: dateTime.toISOString(),
          type: formData.type,
          notes: formData.notes
        }),
      });

      if (!res.ok) throw new Error("Failed to create appointment");
      router.push("/appointments");
    } catch (err) {
      console.error(err);
      alert("Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">New Appointment</h1>
            <p className="text-gray-500 text-sm">Schedule a visit for a patient</p>
          </div>
        </div>

        <MaterialCard elevation="sm" className="border-0 shadow-lg shadow-gray-200/50">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="e.g. John Doe"
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
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm"
                />
              </div>

              {/* Time */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Time</label>
                <input
                  type="time"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
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
                <label className="text-sm font-semibold text-gray-700">Notes (Optional)</label>
                <textarea
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional instructions or symptoms..."
                  className="w-full p-4 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Link href="/appointments">
                <MaterialButton type="button" variant="outlined" className="w-full md:w-auto">
                  Cancel
                </MaterialButton>
              </Link>
              <MaterialButton 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto shadow-lg shadow-blue-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </>
                )}
              </MaterialButton>
            </div>
          </form>
        </MaterialCard>
      </div>
    </div>
  );
}
