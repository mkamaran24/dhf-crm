"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { MaterialCard } from "@/components/MaterialCard";
import { MaterialInput } from "@/components/MaterialInput";
import { MaterialSelect } from "@/components/MaterialSelect";
import { MaterialButton } from "@/components/MaterialButton";

export default function CreatePatientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await fetch("/api/patients", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      router.push("/patients");
    } catch (error) {
      console.error("Failed to create patient", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <MaterialButton variant="text" size="sm" className="pl-0 hover:pl-1 transition-all">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to List
          </MaterialButton>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Add New Patient</h1>
      </div>

      <MaterialCard className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MaterialInput 
              label="First Name" 
              name="firstName" 
              placeholder="e.g. John" 
              required 
            />
            <MaterialInput 
              label="Last Name" 
              name="lastName" 
              placeholder="e.g. Doe" 
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MaterialInput 
              label="Email Address" 
              name="email" 
              type="email" 
              placeholder="john@example.com" 
              required 
            />
            <MaterialInput 
              label="Phone Number" 
              name="phone" 
              type="tel" 
              placeholder="(555) 000-0000" 
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MaterialInput 
              label="Date of Birth" 
              name="dob" 
              type="date" 
              required 
            />
            <MaterialSelect 
              label="Gender" 
              name="gender" 
              options={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Other", value: "Other" },
              ]}
            />
          </div>

          <MaterialInput 
            label="Address" 
            name="address" 
            placeholder="123 Main St, City, Country" 
            required 
          />

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <Link href="/patients">
              <MaterialButton type="button" variant="outlined">
                Cancel
              </MaterialButton>
            </Link>
            <MaterialButton type="submit" isLoading={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              Create Patient
            </MaterialButton>
          </div>
        </form>
      </MaterialCard>
    </div>
  );
}
