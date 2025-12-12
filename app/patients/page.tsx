"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, MoreVertical, Eye } from "lucide-react";
import { MaterialCard } from "@/components/MaterialCard";
import { MaterialButton } from "@/components/MaterialButton";
import { MaterialInput } from "@/components/MaterialInput";
import { MaterialTable } from "@/components/MaterialTable";
import { Patient } from "@/types/patient";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => {
        setPatients(data);
        setIsLoading(false);
      });
  }, []);

  const filteredPatients = patients.filter(p => 
    p.firstName.toLowerCase().includes(search.toLowerCase()) ||
    p.lastName.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
        <Link href="/patients/create">
          <MaterialButton variant="filled">
            <Plus className="w-4 h-4 mr-2" />
            Add Patient
          </MaterialButton>
        </Link>
      </div>

      <MaterialCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="max-w-md">
            <MaterialInput 
              placeholder="Search patients..." 
              icon={<Search className="w-4 h-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading patients...</div>
        ) : (
          <MaterialTable headers={["Name", "Email", "Phone", "Date of Birth", "Actions"]}>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </div>
                    {patient.firstName} {patient.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{patient.email}</td>
                <td className="px-6 py-4 text-gray-600">{patient.phone}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(patient.dob).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <Link href={`/patients/${patient.id}`}>
                    <MaterialButton variant="text" size="sm" className="text-gray-500 hover:text-blue-600">
                      <Eye className="w-4 h-4" />
                    </MaterialButton>
                  </Link>
                </td>
              </tr>
            ))}
            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No patients found matching your search.
                </td>
              </tr>
            )}
          </MaterialTable>
        )}
      </MaterialCard>
    </div>
  );
}
