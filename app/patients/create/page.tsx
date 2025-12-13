"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Users, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Card, CardHeader, CardContent, Button, Input, Select } from "@/src/shared/components/ui";
import { GENDER_OPTIONS } from "@/src/shared/constants";

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

  const genderOptions = GENDER_OPTIONS.map(g => ({ label: g, value: g }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Patient</h1>
          <p className="text-sm text-gray-500 mt-1">Register a new patient in the system</p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Patient Information</h2>
              <p className="text-sm text-gray-500">Complete patient registration form</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Personal Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="First Name" 
                  name="firstName" 
                  placeholder="John" 
                  required 
                />
                <Input 
                  label="Last Name" 
                  name="lastName" 
                  placeholder="Doe" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Date of Birth" 
                  name="dob" 
                  type="date" 
                  required
                  icon={<Calendar className="w-4 h-4" />}
                />
                <Select 
                  label="Gender" 
                  name="gender" 
                  options={genderOptions}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Email Address" 
                  name="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  required
                  icon={<Mail className="w-4 h-4" />}
                />
                <Input 
                  label="Phone Number" 
                  name="phone" 
                  type="tel" 
                  placeholder="+1 (555) 000-0000" 
                  required
                  icon={<Phone className="w-4 h-4" />}
                />
              </div>

              <Input 
                label="Address" 
                name="address" 
                placeholder="123 Main St, City, State, ZIP" 
                required
                icon={<MapPin className="w-4 h-4" />}
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Link href="/patients">
                <Button type="button" variant="outlined">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" isLoading={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                Register Patient
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
