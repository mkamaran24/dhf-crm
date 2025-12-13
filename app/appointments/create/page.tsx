"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Calendar, User, Clock } from "lucide-react";
import { Card, CardHeader, CardContent, Button, Input, Select } from "@/src/shared/components/ui";
import { DOCTORS, APPOINTMENT_TYPES } from "@/src/shared/constants";

export default function CreateAppointmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await fetch("/api/appointments", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      router.push("/appointments");
    } catch (error) {
      console.error("Failed to create appointment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/appointments">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Appointment</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new appointment for a patient</p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Appointment Details</h2>
              <p className="text-sm text-gray-500">Fill in the appointment information</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="Patient Name" 
              name="patientName" 
              placeholder="Enter patient's full name" 
              required
              icon={<User className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select 
                label="Doctor" 
                name="doctor" 
                options={DOCTORS}
              />
              <Select 
                label="Appointment Type" 
                name="type" 
                options={APPOINTMENT_TYPES}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Date" 
                name="date" 
                type="date"
                required
                icon={<Calendar className="w-4 h-4" />}
              />
              <Input 
                label="Time" 
                name="time" 
                type="time"
                required
                icon={<Clock className="w-4 h-4" />}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
              <textarea 
                name="notes" 
                placeholder="Add any additional information about the appointment..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none text-sm"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Link href="/appointments">
                <Button type="button" variant="outlined">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" isLoading={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
