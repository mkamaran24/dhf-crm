"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, UserPlus, Mail, Phone, Calendar, Globe, FileText, DollarSign, Users, MapPin, Plus, Star, CheckCircle2, AlertCircle, Target, Upload, X, LayoutDashboard } from "lucide-react";
import { Card, CardHeader, CardContent, Button, Input, Select, Textarea } from "@/src/shared/components/ui";
import { LEAD_STATUSES, REFERRAL_SOURCES, IRAQI_CITIES } from "@/src/shared/constants";
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

export default function CreateLeadPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customAddresses, setCustomAddresses] = useState<Record<string, string[]>>({});
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    phoneSecondary: "",
    status: "Contacted" as string,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = {
      ...formData,
      knowledgeRating: formData.knowledgeRating,
      referralPersonName: isPersonReferral ? formData.referralPersonName : undefined,
      referralPersonPhone: isPersonReferral ? formData.referralPersonPhone : undefined,
    };

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
        address: addresses.length > 0 ? addresses[0] : ""
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
          <h1 className="text-2xl font-bold text-gray-900">Add New Lead</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new lead in the pipeline</p>
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
                  placeholder="John Doe"
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
                  placeholder="+964 750 000 0000"
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
            {/* Section 1: Financial & Referral Distribution (50/50 Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Side: Budget Slider (Standardized Style) */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm relative group">
                <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
                  <label className="block text-sm font-medium text-gray-900 uppercase tracking-tight flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    Estimated Budget
                  </label>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100">IQD Range</span>
                </div>

                <div className="space-y-6 px-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Target Investment</span>
                    <div className="text-blue-600 px-3 py-1 rounded-lg text-[11px] font-medium border border-blue-100 bg-blue-50">
                      {formData.budgetMin.toLocaleString()} - {formData.budgetMax.toLocaleString()} IQD
                    </div>
                  </div>

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
                    step={500000}
                    disableSwap
                    sx={{
                      color: '#2563eb',
                      height: 6,
                      '& .MuiSlider-thumb': {
                        width: 18,
                        height: 18,
                        backgroundColor: '#fff',
                        border: '3px solid currentColor',
                        '&:hover, &.Mui-focusVisible, &.Mui-active': {
                          boxShadow: '0px 0px 0px 6px rgba(37, 99, 235, 0.12)',
                        },
                      },
                      '& .MuiSlider-rail': {
                        opacity: 0.1,
                        backgroundColor: '#94a3b8',
                      },
                      '& .MuiSlider-track': {
                        border: 'none',
                        height: 6,
                      },
                    }}
                  />

                  <div className="flex justify-between text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                    <span>MIN: {BUDGET_MIN.toLocaleString()}</span>
                    <span>MAX: {BUDGET_MAX.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Referral & Doctors (Standardized Style) */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-center">
                <div className="space-y-4">
                  <Select
                    label="Referral Source"
                    name="referralSource"
                    value={formData.referralSource}
                    onChange={handleChange}
                    options={referralOptions}
                  />

                  <Input
                    label="Previous Doctors"
                    name="previousDoctors"
                    value={formData.previousDoctors}
                    onChange={handleChange}
                    placeholder="Previous doctor/clinic..."
                    icon={<Users className="w-4 h-4" />}
                  />

                  {isPersonReferral && (
                    <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-in slide-in-from-top-2">
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Referral Link</p>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Person Name"
                          name="referralPersonName"
                          value={formData.referralPersonName}
                          onChange={handleChange}
                          placeholder="Name"
                          className="h-9 text-sm"
                        />
                        <Input
                          label="Person Phone"
                          name="referralPersonPhone"
                          type="tel"
                          value={formData.referralPersonPhone}
                          onChange={handleChange}
                          placeholder="+964..."
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Engagement Insights */}
            <div className="space-y-6">
              {/* Decision Influencers & Pain Points - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm relative group transition-all hover:shadow-md">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-tight flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      Decision Influencers
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DECISION_INFLUENCERS.map(influencer => (
                      <button
                        key={influencer}
                        type="button"
                        onClick={() => handleCheckboxChange("decisionInfluencers", influencer)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all duration-200 ${formData.decisionInfluencers.includes(influencer)
                          ? "border-blue-500 bg-blue-50/50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${formData.decisionInfluencers.includes(influencer)
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-300 bg-white"
                          }`}>
                          {formData.decisionInfluencers.includes(influencer) && (
                            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                          )}
                        </div>
                        <span className={`font-medium ${formData.decisionInfluencers.includes(influencer) ? "text-blue-700" : "text-gray-700"}`}>{influencer}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm relative group transition-all hover:shadow-md">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-tight flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600" />
                      Pain Points
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PAIN_POINTS.map(painPoint => (
                      <button
                        key={painPoint}
                        type="button"
                        onClick={() => handleCheckboxChange("painPoints", painPoint)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all duration-200 ${formData.painPoints.includes(painPoint)
                          ? "border-blue-500 bg-blue-50/50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${formData.painPoints.includes(painPoint)
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-300 bg-white"
                          }`}>
                          {formData.painPoints.includes(painPoint) && (
                            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                          )}
                        </div>
                        <span className={`font-medium ${formData.painPoints.includes(painPoint) ? "text-blue-700" : "text-gray-700"}`}>{painPoint}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Knowledge & Commit Level - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-tight flex items-center gap-2">
                      <Star className="w-4 h-4 text-blue-600" />
                      Knowledge Rating
                    </h3>
                  </div>
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
                            className={`w-7 h-7 ${star <= formData.knowledgeRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-50 text-gray-200 group-hover:text-yellow-200"
                              } transition-all duration-200`}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                      {formData.knowledgeRating}/5
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-tight flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      Commit Level
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-gray-900">{formData.commitLevel}%</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${formData.commitLevel >= 80 ? "bg-green-100 text-green-700" :
                        formData.commitLevel >= 55 ? "bg-blue-100 text-blue-700" :
                          formData.commitLevel >= 30 ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                        }`}>
                        {formData.commitLevel >= 80 ? "V.High" :
                          formData.commitLevel >= 55 ? "High" :
                            formData.commitLevel >= 30 ? "Med" : "Low"}
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
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Insights Section (Shrunk design) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Educational Materials */}
                <div className="rounded-xl border bg-white border-gray-200 shadow-sm transition-all hover:shadow-md">
                  <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded border border-blue-600 bg-blue-600 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-900 uppercase tracking-tight">Shared Materials</span>
                    </div>
                  </div>

                  <div className="p-3 space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-medium text-gray-400 uppercase tracking-widest pl-1">Materials Notes</label>
                      <Textarea
                        name="sharedEducationalMaterialsNotes"
                        value={formData.sharedEducationalMaterialsNotes || ""}
                        onChange={handleChange}
                        placeholder="What was shared?"
                        rows={1}
                        className="text-[11px] bg-slate-50 min-h-[45px] border-slate-200 rounded-lg p-2"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-medium text-gray-400 uppercase tracking-widest pl-1">Attached Files</label>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 p-1.5 bg-blue-50/50 border border-blue-100 border-dashed rounded-lg cursor-pointer hover:bg-blue-50 transition-all group">
                          <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[10px] font-medium text-blue-700">Add Documents</span>
                          <input type="file" multiple onChange={handleFileUpload} className="hidden" />
                        </label>

                        <div className="grid grid-cols-1 gap-1">
                          {formData.sharedEducationalMaterialsFiles?.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-1.5 bg-slate-50 rounded-lg border border-slate-100 animate-in fade-in">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                <span className="text-[10px] font-medium text-slate-600 truncate">{file.name}</span>
                              </div>
                              <button onClick={() => handleRemoveFile(file.id)} className="p-1 text-slate-400 hover:text-red-500 rounded transition-all">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Competitors Considered */}
                <div className="rounded-xl border bg-white border-gray-200 shadow-sm transition-all hover:shadow-md">
                  <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded border border-blue-600 bg-blue-600 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-900 uppercase tracking-tight">Competitors</span>
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <label className="text-[9px] font-medium text-gray-400 uppercase tracking-widest pl-1">Known Competitors</label>
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
                      placeholder="List other clinics..."
                      rows={4}
                      className="text-[11px] bg-slate-50 min-h-[108px] border-slate-200 rounded-lg p-2"
                    />
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

        <div className="flex justify-end gap-3">
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
    </div>
  );
}
