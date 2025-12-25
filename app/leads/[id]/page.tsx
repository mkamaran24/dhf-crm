"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Save, Loader2, UserPlus, Mail, Phone, Trash2, Calendar, Globe, FileText, DollarSign, Users, MapPin, Plus, Star, CheckCircle2, AlertCircle, Target, Upload, X, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button, Card, CardHeader, CardContent, Input, Select, Textarea } from "@/src/shared/components/ui";
import { DeleteConfirmationModal } from "@/src/shared/components/ui";
import { Lead } from "@/src/features/leads/types";
import { LEAD_STATUSES, REFERRAL_SOURCES, IRAQI_CITIES } from "@/src/shared/constants";
import { LeadStatus } from "@/src/shared/types";
import Slider from '@mui/material/Slider';

const GENDERS = ["Male", "Female"];
const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];
const LANGUAGES = ["English", "Arabic", "Kurdish"];
const PATIENT_TYPES = ["Cardiac", "Cardiology"];
const DECISION_INFLUENCERS = ["Family", "Insurance", "Online Reviews", "Physician Referral"];
const PAIN_POINTS = ["Cost", "Waiting Time", "Trust", "Proximity", "Service Quality"];
const COMMIT_LEVELS = [
  { value: "Low", label: "Low", min: 0, max: 25, color: "text-red-500" },
  { value: "Medium", label: "Medium", min: 26, max: 50, color: "text-yellow-500" },
  { value: "High", label: "High", min: 51, max: 75, color: "text-blue-500" },
  { value: "Very High", label: "Very High", min: 76, max: 100, color: "text-green-500" },
];

const BUDGET_MIN = 0;
const BUDGET_MAX = 100000000;

export default function EditLeadPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customAddresses, setCustomAddresses] = useState<Record<string, string[]>>({});
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    phoneSecondary: "",
    status: "Contacted" as LeadStatus,
    dob: "",
    gender: "",
    maritalStatus: "",
    language: "",
    country: "Iraq",
    city: "",
    address: "",
    patientType: "",
    budgetMin: 0,
    budgetMax: 10000000,
    referralSource: "",
    referralPersonName: "",
    referralPersonPhone: "",
    previousDoctors: "",
    sharedEducationalMaterials: false,
    sharedEducationalMaterialsNotes: "",
    sharedEducationalMaterialsFiles: [] as Array<{ id: string; name: string; type: string; size: string; uploadedAt: string }>,
    hasCompetitorsConsidered: false,
    competitorsConsidered: [] as string[],
    decisionInfluencers: [] as string[],
    painPoints: [] as string[],
    knowledgeRating: 0,
    commitLevel: 0,
    notes: "",
  });

  const selectedReferral = REFERRAL_SOURCES.find(r => r.value === formData.referralSource);
  const isPersonReferral = selectedReferral?.isPerson || false;

  useEffect(() => {
    if (leadId) {
      fetch(`/api/leads/${leadId}`)
        .then((res) => res.json())
        .then((lead: Lead) => {
          setFormData({
            name: lead.name || "",
            phone: lead.phone || "",
            phoneSecondary: lead.phoneSecondary || "",
            status: lead.status || "Contacted",
            dob: lead.dob || "",
            gender: lead.gender || "",
            maritalStatus: lead.maritalStatus || "",
            language: lead.language || "",
            country: lead.country || "Iraq",
            city: lead.city || "",
            address: lead.address || "",
            patientType: lead.patientType || "",
            budgetMin: lead.budgetMin || 0,
            budgetMax: lead.budgetMax || 10000000,
            referralSource: lead.referralSource || "",
            referralPersonName: lead.referralPersonName || "",
            referralPersonPhone: lead.referralPersonPhone || "",
            previousDoctors: lead.previousDoctors || "",
            sharedEducationalMaterials: lead.sharedEducationalMaterials || false,
            sharedEducationalMaterialsNotes: lead.sharedEducationalMaterialsNotes || "",
            sharedEducationalMaterialsFiles: lead.sharedEducationalMaterialsFiles || [],
            hasCompetitorsConsidered: lead.hasCompetitorsConsidered ?? !!(lead.competitorsConsidered && lead.competitorsConsidered.length > 0),
            competitorsConsidered: lead.competitorsConsidered || [],
            decisionInfluencers: lead.decisionInfluencers || [],
            painPoints: lead.painPoints || [],
            knowledgeRating: lead.knowledgeRating || 0,
            commitLevel: typeof lead.commitLevel === 'number' ? lead.commitLevel :
              lead.commitLevel === 'Very High' ? 90 :
                lead.commitLevel === 'High' ? 65 :
                  lead.commitLevel === 'Medium' ? 40 :
                    lead.commitLevel === 'Low' ? 15 : 0,
            notes: lead.notes || "",
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

    const data = {
      ...formData,
      knowledgeRating: formData.knowledgeRating,
      referralPersonName: isPersonReferral ? formData.referralPersonName : undefined,
      referralPersonPhone: isPersonReferral ? formData.referralPersonPhone : undefined,
    };

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

  const getAvailableAddresses = (cityName: string): string[] => {
    const city = IRAQI_CITIES.find(c => c.name === cityName);
    const baseAddresses = city ? city.addresses : [];
    const custom = customAddresses[cityName] || [];
    return [...baseAddresses, ...custom];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "city") {
      const addresses = getAvailableAddresses(value);
      setFormData(prev => ({
        ...prev,
        city: value,
        address: addresses.length > 0 && !addresses.includes(prev.address) ? addresses[0] : prev.address
      }));
      setShowAddAddress(false);
      setNewAddress("");
    } else if (name === "referralSource") {
      setFormData(prev => ({
        ...prev,
        referralSource: value,
        referralPersonName: "",
        referralPersonPhone: "",
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddAddress = () => {
    if (newAddress.trim() && formData.city) {
      setCustomAddresses(prev => ({
        ...prev,
        [formData.city]: [...(prev[formData.city] || []), newAddress.trim()]
      }));
      setFormData(prev => ({ ...prev, address: newAddress.trim() }));
      setNewAddress("");
      setShowAddAddress(false);
    }
  };


  const handleCheckboxChange = (name: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[name as keyof typeof prev] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [name]: newArray };
    });
  };

  const handleBooleanChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        uploadedAt: new Date().toISOString(),
      }));
      setFormData(prev => ({
        ...prev,
        sharedEducationalMaterialsFiles: [...(prev.sharedEducationalMaterialsFiles || []), ...newFiles]
      }));
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setFormData(prev => ({
      ...prev,
      sharedEducationalMaterialsFiles: prev.sharedEducationalMaterialsFiles?.filter(f => f.id !== fileId) || []
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const statusOptions = LEAD_STATUSES.map(s => ({ label: s, value: s }));
  const genderOptions = GENDERS.map(g => ({ label: g, value: g }));
  const maritalStatusOptions = MARITAL_STATUSES.map(m => ({ label: m, value: m }));
  const languageOptions = LANGUAGES.map(l => ({ label: l, value: l }));
  const patientTypeOptions = PATIENT_TYPES.map(p => ({ label: p, value: p }));
  const cityOptions = IRAQI_CITIES.map(city => ({ label: city.name, value: city.name }));
  const referralOptions = REFERRAL_SOURCES.map(r => ({ label: r.label, value: r.value }));
  const addressOptions = formData.city ? getAvailableAddresses(formData.city).map(addr => ({ label: addr, value: addr })) : [];

  const handleStarClick = (rating: number) => {
    setFormData(prev => ({ ...prev, knowledgeRating: rating }));
  };



  return (
    <div className="max-w-4xl mx-auto space-y-6">
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                <p className="text-sm text-gray-500">Essential lead contact details</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  icon={<Phone className="w-4 h-4" />}
                />
                <Input
                  label="Phone Number 2 (Optional)"
                  name="phoneSecondary"
                  type="tel"
                  value={formData.phoneSecondary}
                  onChange={handleChange}
                  placeholder="+964 770 000 0000"
                  icon={<Phone className="w-4 h-4" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={genderOptions}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Marital Status"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  options={maritalStatusOptions}
                />
                <Select
                  label="Language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  options={languageOptions}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Iraq"
                  icon={<Globe className="w-4 h-4" />}
                />
                <Select
                  label="Type of Patient"
                  name="patientType"
                  value={formData.patientType}
                  onChange={handleChange}
                  options={patientTypeOptions}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  options={cityOptions}
                />
                <div className="space-y-2">
                  <Select
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    options={addressOptions}
                  />
                  {formData.city && (
                    <div className="space-y-2">
                      {!showAddAddress ? (
                        <button
                          type="button"
                          onClick={() => setShowAddAddress(true)}
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add New Address
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter new address"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddAddress();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={handleAddAddress}
                            variant="filled"
                            className="whitespace-nowrap"
                          >
                            Add
                          </Button>
                          <Button
                            type="button"
                            onClick={() => {
                              setShowAddAddress(false);
                              setNewAddress("");
                            }}
                            variant="outlined"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Financial, Referral & Engagement</h2>
                <p className="text-sm text-gray-500">Budget, referral source, and decision details</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* Section 1: Budget & Referral */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Side: Budget (Takes 2 columns) */}
              <div className="lg:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Budget Range (IQD)
                </label>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Minimum</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">IQD</span>
                        <Input
                          type="number"
                          value={formData.budgetMin}
                          onChange={(e) => {
                            const val = Math.max(BUDGET_MIN, Math.min(Number(e.target.value), formData.budgetMax - 100000));
                            setFormData(prev => ({ ...prev, budgetMin: val }));
                          }}
                          className="pl-10 py-1.5 text-sm h-9"
                          min={BUDGET_MIN}
                          max={formData.budgetMax - 100000}
                          step={100000}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Maximum</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">IQD</span>
                        <Input
                          type="number"
                          value={formData.budgetMax}
                          onChange={(e) => {
                            const val = Math.min(BUDGET_MAX, Math.max(Number(e.target.value), formData.budgetMin + 100000));
                            setFormData(prev => ({ ...prev, budgetMax: val }));
                          }}
                          className="pl-10 py-1.5 text-sm h-9"
                          min={formData.budgetMin + 100000}
                          max={BUDGET_MAX}
                          step={100000}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-2">
                    <Slider
                      getAriaLabel={() => 'Budget range'}
                      value={[formData.budgetMin, formData.budgetMax]}
                      onChange={(event: Event, newValue: number | number[], activeThumb: number) => {
                        if (Array.isArray(newValue)) {
                          const minDistance = 100000;
                          if (activeThumb === 0) {
                            setFormData(prev => ({
                              ...prev,
                              budgetMin: Math.min(newValue[0], prev.budgetMax - minDistance)
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              budgetMax: Math.max(newValue[1], prev.budgetMin + minDistance)
                            }));
                          }
                        }
                      }}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value.toLocaleString()} IQD`}
                      min={BUDGET_MIN}
                      max={BUDGET_MAX}
                      step={100000}
                      disableSwap
                      size="small"
                      sx={{
                        color: '#6b7280',
                        '& .MuiSlider-thumb': {
                          backgroundColor: '#374151',
                          border: '2px solid white',
                          width: 16,
                          height: 16,
                          '&:hover': {
                            boxShadow: '0 0 0 8px rgba(55, 65, 81, 0.16)',
                          },
                        },
                        '& .MuiSlider-track': {
                          backgroundColor: '#9ca3af',
                        },
                        '& .MuiSlider-rail': {
                          backgroundColor: '#e5e7eb',
                        },
                      }}
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                      <span>{BUDGET_MIN.toLocaleString()} IQD</span>
                      <span className="font-medium text-gray-700">
                        {formData.budgetMin.toLocaleString()} - {formData.budgetMax.toLocaleString()} IQD
                      </span>
                      <span>{BUDGET_MAX.toLocaleString()} IQD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Referral & Doctors */}
              <div className="space-y-4">
                <Select
                  label="Referral Source"
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleChange}
                  options={referralOptions}
                />
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={statusOptions}
                />

                {isPersonReferral && (
                  <div className="space-y-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <Input
                      label="Referral Person Name"
                      name="referralPersonName"
                      value={formData.referralPersonName}
                      onChange={handleChange}
                      placeholder="Enter name"
                      className="h-9 text-sm"
                    />
                    <Input
                      label="Referral Person Phone"
                      name="referralPersonPhone"
                      type="tel"
                      value={formData.referralPersonPhone}
                      onChange={handleChange}
                      placeholder="+964..."
                      icon={<Phone className="w-3 h-3" />}
                      className="h-9 text-sm"
                    />
                  </div>
                )}

                <Input
                  label="Previous Doctors"
                  name="previousDoctors"
                  value={formData.previousDoctors}
                  onChange={handleChange}
                  placeholder="Dr. Name..."
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8 mt-8">
              <div className="space-y-6">
                {/* Decision Influencers & Pain Points - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      Decision Influencers
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {DECISION_INFLUENCERS.map(influencer => (
                        <button
                          key={influencer}
                          type="button"
                          onClick={() => handleCheckboxChange("decisionInfluencers", influencer)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all duration-200 ${formData.decisionInfluencers.includes(influencer)
                            ? "border-gray-500 bg-white shadow-sm ring-1 ring-gray-200"
                            : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${formData.decisionInfluencers.includes(influencer)
                            ? "border-gray-800 bg-gray-800"
                            : "border-gray-300 bg-white"
                            }`}>
                            {formData.decisionInfluencers.includes(influencer) && (
                              <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>
                          <span className="font-medium text-gray-700">{influencer}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-600" />
                      Pain Points
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {PAIN_POINTS.map(painPoint => (
                        <button
                          key={painPoint}
                          type="button"
                          onClick={() => handleCheckboxChange("painPoints", painPoint)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all duration-200 ${formData.painPoints.includes(painPoint)
                            ? "border-gray-500 bg-white shadow-sm ring-1 ring-gray-200"
                            : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${formData.painPoints.includes(painPoint)
                            ? "border-gray-800 bg-gray-800"
                            : "border-gray-300 bg-white"
                            }`}>
                            {formData.painPoints.includes(painPoint) && (
                              <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>
                          <span className="font-medium text-gray-700">{painPoint}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Knowledge & Commit Level - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-gray-600" />
                      Knowledge Rating
                    </h3>
                    <div className="flex items-center justify-center py-2 relative">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleStarClick(star)}
                            className="transition-transform duration-200 hover:scale-110 active:scale-95 p-1 group"
                          >
                            <Star
                              className={`w-8 h-8 ${star <= formData.knowledgeRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-100 text-gray-300 group-hover:text-yellow-200"
                                } transition-all duration-200`}
                            />
                          </button>
                        ))}
                      </div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
                        {formData.knowledgeRating}/5
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-600" />
                        Commit Level
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{formData.commitLevel}%</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${formData.commitLevel >= 80 ? "bg-green-100 text-green-700" :
                          formData.commitLevel >= 55 ? "bg-blue-100 text-blue-700" :
                            formData.commitLevel >= 30 ? "bg-yellow-100 text-yellow-700" :
                              "bg-red-100 text-red-700"
                          }`}>
                          {formData.commitLevel >= 80 ? "Very High" :
                            formData.commitLevel >= 55 ? "High" :
                              formData.commitLevel >= 30 ? "Medium" : "Low"}
                        </span>
                      </div>
                    </div>
                    <div className="px-2">
                      <Slider
                        value={formData.commitLevel}
                        onChange={(e, value) => {
                          setFormData(prev => ({ ...prev, commitLevel: value as number }));
                        }}
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                        size="small"
                        sx={{
                          color: formData.commitLevel >= 80 ? '#15803d' :
                            formData.commitLevel >= 55 ? '#1d4ed8' :
                              formData.commitLevel >= 30 ? '#a16207' : '#b91c1c',
                          height: 6,
                          '& .MuiSlider-thumb': {
                            width: 16,
                            height: 16,
                            transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                            '&:before': { boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)' },
                            '&:hover, &.Mui-focusVisible': {
                              boxShadow: '0px 0px 0px 8px rgb(0 0 0 / 16%)',
                            },
                            '&.Mui-active': { width: 16, height: 16 },
                          },
                          '& .MuiSlider-rail': { opacity: 0.28 },
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Toggles Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Educational Materials Toggle */}
                  <div className={`rounded-xl border transition-all duration-200 ${formData.sharedEducationalMaterials ? "bg-blue-50/50 border-blue-200" : "bg-white border-gray-200"
                    }`}>
                    <button
                      type="button"
                      onClick={() => handleBooleanChange("sharedEducationalMaterials", !formData.sharedEducationalMaterials)}
                      className="w-full flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.sharedEducationalMaterials ? "border-blue-600 bg-blue-600" : "border-gray-300"
                          }`}>
                          {formData.sharedEducationalMaterials && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-sm font-medium text-gray-900">Shared Materials</span>
                      </div>
                    </button>

                    {formData.sharedEducationalMaterials && (
                      <div className="px-4 pb-4 pt-0 space-y-3">
                        <label className="flex items-center gap-2 p-2 bg-white border border-blue-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <Upload className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-xs text-gray-700">Upload Files</span>
                          <input type="file" multiple onChange={handleFileUpload} className="hidden" />
                        </label>

                        {formData.sharedEducationalMaterialsFiles?.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100">
                            <span className="text-xs truncate max-w-[150px]">{file.name}</span>
                            <button onClick={() => handleRemoveFile(file.id)} className="text-gray-400 hover:text-red-500">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}

                        <Textarea
                          name="sharedEducationalMaterialsNotes"
                          value={formData.sharedEducationalMaterialsNotes || ""}
                          onChange={handleChange}
                          placeholder="Add notes..."
                          rows={2}
                          className="text-xs bg-white min-h-[60px]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Competitors Toggle */}
                  <div className={`rounded-xl border transition-all duration-200 ${formData.hasCompetitorsConsidered ? "bg-blue-50/50 border-blue-200" : "bg-white border-gray-200"
                    }`}>
                    <button
                      type="button"
                      onClick={() => handleBooleanChange("hasCompetitorsConsidered", !formData.hasCompetitorsConsidered)}
                      className="w-full flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.hasCompetitorsConsidered ? "border-blue-600 bg-blue-600" : "border-gray-300"
                          }`}>
                          {formData.hasCompetitorsConsidered && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-sm font-medium text-gray-900">Competitors Considered</span>
                      </div>
                    </button>

                    {formData.hasCompetitorsConsidered && (
                      <div className="px-4 pb-4 pt-0">
                        <Textarea
                          name="competitorsConsidered"
                          value={formData.competitorsConsidered.join(", ")}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              competitorsConsidered: value ? value.split(",").map(s => s.trim()).filter(s => s) : []
                            }));
                          }}
                          placeholder="e.g. Hospital A, Clinic B"
                          rows={2}
                          className="text-xs bg-white min-h-[60px]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Additional Notes</h2>
                <p className="text-sm text-gray-500">Any additional information about the lead</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes or comments..."
              rows={4}
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-6">
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

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        itemName={formData.name}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
