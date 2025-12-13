"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, Button, Input, Select } from "@/src/shared/components/ui";
import { ChevronLeft, Save, Trash2, Loader2, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import { Appointment } from "@/src/features/appointments/types";
import { DeleteConfirmationModal } from "@/src/shared/components/ui";
import { DOCTORS, APPOINTMENT_TYPES } from "@/src/shared/constants";

export default function AppointmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Appointment>>({
    patientName: "",
    doctor: DOCTORS[0].value,
    type: APPOINTMENT_TYPES[0].value,
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
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/appointments/${unwrappedParams.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/appointments");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) {
     return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
     );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/appointments">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
          <p className="text-sm text-gray-500 mt-1">View and update appointment information</p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Appointment Information</h2>
              <p className="text-sm text-gray-500">Update appointment details below</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Patient Name"
                name="patientName"
                required
                value={formData.patientName}
                onChange={handleChange}
                icon={<User className="w-4 h-4" />}
              />

              <Select
                label="Doctor"
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                options={DOCTORS}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Date"
                type="date"
                value={datePart}
                onChange={(e) => setDatePart(e.target.value)}
                required
                icon={<Calendar className="w-4 h-4" />}
              />

              <Input
                label="Time"
                type="time"
                value={timePart}
                onChange={(e) => setTimePart(e.target.value)}
                required
                icon={<Clock className="w-4 h-4" />}
              />
            </div>

            <Select
              label="Appointment Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={APPOINTMENT_TYPES}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
              <textarea
                name="notes"
                rows={4}
                value={formData.notes || ""}
                onChange={handleChange}
                placeholder="Add any additional notes about this appointment..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none text-sm"
              />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <Button 
                type="button" 
                variant="text" 
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 hover:bg-red-50"
              >
                 <Trash2 className="w-4 h-4 mr-2" />
                 Cancel Appointment
              </Button>

              <div className="flex items-center gap-3">
                 <Link href="/appointments">
                  <Button type="button" variant="outlined">
                    Back
                  </Button>
                </Link>
                <Button 
                    type="submit" 
                    isLoading={saving}
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        itemName={`appointment with ${formData.patientName}`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
