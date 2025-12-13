"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, UserPlus, Mail, Phone } from "lucide-react";
import { Card, CardHeader, CardContent, Button, Input, Select } from "@/src/shared/components/ui";
import { LEAD_STATUSES, LEAD_SOURCES } from "@/src/shared/constants";

export default function CreateLeadPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await fetch("/api/leads", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      router.push("/leads");
    } catch (error) {
      console.error("Failed to create lead", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sourceOptions = LEAD_SOURCES.map(s => ({ label: s, value: s }));
  const statusOptions = LEAD_STATUSES.map(s => ({ label: s, value: s }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/leads">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Lead</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new lead in the pipeline</p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Lead Information</h2>
              <p className="text-sm text-gray-500">Enter the lead's contact details</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select 
                label="Lead Source" 
                name="source" 
                options={sourceOptions}
              />
              <Select 
                label="Initial Status" 
                name="status" 
                options={statusOptions}
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Link href="/leads">
                <Button type="button" variant="outlined">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" isLoading={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                Create Lead
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
