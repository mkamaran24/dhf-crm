"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Save, Loader2, UserPlus, Mail, Phone, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button, Card, CardHeader, CardContent, Input, Select } from "@/src/shared/components/ui";
import { DeleteConfirmationModal } from "@/src/shared/components/ui";
import { Lead } from "@/src/features/leads/types";
import { LEAD_STATUSES, LEAD_SOURCES } from "@/src/shared/constants";
import { LeadStatus } from "@/src/shared/types";

export default function EditLeadPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    source: "Website",
    status: "New" as LeadStatus,
  });

  useEffect(() => {
    if (leadId) {
      fetch(`/api/leads/${leadId}`)
        .then((res) => res.json())
        .then((lead: Lead) => {
          setFormData({
            firstName: lead.firstName,
            lastName: lead.lastName,
            email: lead.email,
            phone: lead.phone,
            source: lead.source,
            status: lead.status,
          });
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [leadId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/leads");
      }
    } catch (error) {
      console.error("Error updating lead:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/leads");
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Edit Lead</h1>
          <p className="text-sm text-gray-500 mt-1">Update lead information</p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Lead Details</h2>
              <p className="text-sm text-gray-500">Manage lead information and status</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                icon={<Mail className="w-4 h-4" />}
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                icon={<Phone className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Lead Source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                options={sourceOptions}
              />
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={statusOptions}
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
                Delete Lead
              </Button>

              <div className="flex items-center gap-3">
                <Link href="/leads">
                  <Button type="button" variant="outlined">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" isLoading={isSaving}>
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
        itemName={`${formData.firstName} ${formData.lastName}`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
