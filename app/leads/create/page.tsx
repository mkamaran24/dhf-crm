"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, UserPlus, Mail, Phone, Calendar, Globe, FileText, DollarSign, Users, MapPin, Plus, Star, CheckCircle2, AlertCircle, Target, Upload, X } from "lucide-react";
import { Card, CardHeader, CardContent, Button, Input, Select, Textarea } from "@/src/shared/components/ui";
import { LEAD_STATUSES, REFERRAL_SOURCES, IRAQI_CITIES } from "@/src/shared/constants";
import Slider from '@mui/material/Slider';

const GENDERS = ["Male", "Female"];
const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];
const LANGUAGES = ["English", "Spanish", "French", "German", "Arabic", "Hindi", "Chinese", "Other"];
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
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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
    commitLevel: "" as 'Low' | 'Medium' | 'High' | 'Very High' | '',
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

  const handleCommitLevelClick = (level: 'Low' | 'Medium' | 'High' | 'Very High') => {
    setFormData(prev => ({ ...prev, commitLevel: level }));
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="First Name" 
                  name="firstName" 
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John" 
                  required 
                />
                <Input 
                  label="Last Name" 
                  name="lastName" 
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe" 
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
                  placeholder="john@example.com" 
                  required
                  icon={<Mail className="w-4 h-4" />}
                />
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
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Budget & Referral</h2>
                <p className="text-sm text-gray-500">Financial information and referral source</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Budget Range (IQD)
                </label>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Minimum</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">IQD</span>
                        <Input
                          type="number"
                          value={formData.budgetMin}
                          onChange={(e) => {
                            const val = Math.max(BUDGET_MIN, Math.min(Number(e.target.value), formData.budgetMax - 100000));
                            setFormData(prev => ({ ...prev, budgetMin: val }));
                          }}
                          className="pl-12"
                          min={BUDGET_MIN}
                          max={formData.budgetMax - 100000}
                          step={100000}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Maximum</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">IQD</span>
                        <Input
                          type="number"
                          value={formData.budgetMax}
                          onChange={(e) => {
                            const val = Math.min(BUDGET_MAX, Math.max(Number(e.target.value), formData.budgetMin + 100000));
                            setFormData(prev => ({ ...prev, budgetMax: val }));
                          }}
                          className="pl-12"
                          min={formData.budgetMin + 100000}
                          max={BUDGET_MAX}
                          step={100000}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
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
                      sx={{
                        color: '#6b7280',
                        '& .MuiSlider-thumb': {
                          backgroundColor: '#374151',
                          border: '2px solid white',
                          width: 20,
                          height: 20,
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
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{BUDGET_MIN.toLocaleString()} IQD</span>
                      <span className="font-medium text-gray-700">
                        {formData.budgetMin.toLocaleString()} - {formData.budgetMax.toLocaleString()} IQD
                      </span>
                      <span>{BUDGET_MAX.toLocaleString()} IQD</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select 
                  label="Referral Source" 
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleChange}
                  options={referralOptions}
                />
              </div>

              {isPersonReferral && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <Input 
                    label="Referral Person Name" 
                    name="referralPersonName" 
                    value={formData.referralPersonName}
                    onChange={handleChange}
                    placeholder="Enter referral person name"
                  />
                  <Input 
                    label="Referral Person Phone" 
                    name="referralPersonPhone" 
                    type="tel"
                    value={formData.referralPersonPhone}
                    onChange={handleChange}
                    placeholder="+964 750 000 0000"
                    icon={<Phone className="w-4 h-4" />}
                  />
                </div>
              )}

              <Input 
                label="Previous Doctors (if any)" 
                name="previousDoctors" 
                value={formData.previousDoctors}
                onChange={handleChange}
                placeholder="Dr. Smith, Dr. Jones, etc."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Decision & Engagement</h2>
                <p className="text-sm text-gray-500">Influencers, pain points, and engagement level</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  Decision Influencers
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {DECISION_INFLUENCERS.map(influencer => (
                    <button
                      key={influencer}
                      type="button"
                      onClick={() => handleCheckboxChange("decisionInfluencers", influencer)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                        formData.decisionInfluencers.includes(influencer)
                          ? "border-gray-400 bg-gray-100 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        formData.decisionInfluencers.includes(influencer)
                          ? "border-gray-700 bg-gray-700"
                          : "border-gray-300 bg-white"
                      }`}>
                        {formData.decisionInfluencers.includes(influencer) && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{influencer}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                  Pain Points
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PAIN_POINTS.map(painPoint => (
                    <button
                      key={painPoint}
                      type="button"
                      onClick={() => handleCheckboxChange("painPoints", painPoint)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                        formData.painPoints.includes(painPoint)
                          ? "border-gray-400 bg-gray-100 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        formData.painPoints.includes(painPoint)
                          ? "border-gray-700 bg-gray-700"
                          : "border-gray-300 bg-white"
                      }`}>
                        {formData.painPoints.includes(painPoint) && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{painPoint}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col items-center justify-center">
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-gray-600" />
                    Knowledge Rating
                  </h3>
                  <div className="flex items-center gap-2 justify-center py-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        className="transition-transform duration-200 hover:scale-110 active:scale-95"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= formData.knowledgeRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-300"
                          } transition-all duration-200`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-3">
                    {formData.knowledgeRating === 0
                      ? "No rating selected"
                      : `${formData.knowledgeRating} out of 5 stars`}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-gray-600" />
                    Commit Level
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {COMMIT_LEVELS.map((level) => {
                      const isSelected = formData.commitLevel === level.value;
                      const percentage = ((level.min + level.max) / 2).toFixed(0);
                      const circumference = 2 * Math.PI * 18;
                      const offset = circumference - ((level.max / 100) * circumference);

                      return (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => handleCommitLevelClick(level.value as 'Low' | 'Medium' | 'High' | 'Very High')}
                          className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                            isSelected
                              ? "border-gray-700 bg-white shadow-md scale-105"
                              : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="relative w-12 h-12">
                              <svg className="transform -rotate-90 w-12 h-12">
                                <circle
                                  cx="24"
                                  cy="24"
                                  r="18"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                  className="text-gray-200"
                                />
                                <circle
                                  cx="24"
                                  cy="24"
                                  r="18"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                  className={isSelected ? level.color : "text-gray-400"}
                                  strokeDasharray={circumference}
                                  strokeDashoffset={offset}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-xs font-bold ${isSelected ? "text-gray-900" : "text-gray-600"}`}>
                                  {percentage}%
                                </span>
                              </div>
                            </div>
                            <span className={`text-xs font-semibold ${
                              isSelected ? "text-gray-900" : "text-gray-600"
                            }`}>
                              {level.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {level.min}-{level.max}%
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => handleBooleanChange("sharedEducationalMaterials", !formData.sharedEducationalMaterials)}
                  className="w-full bg-gray-50 rounded-xl p-6 border border-gray-200 hover:bg-gray-100 transition-all duration-200 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        formData.sharedEducationalMaterials
                          ? "border-gray-700 bg-gray-700"
                          : "border-gray-300 bg-white"
                      }`}>
                        {formData.sharedEducationalMaterials && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        Shared Educational Materials
                      </span>
                    </div>
                    <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.sharedEducationalMaterials
                        ? "bg-gray-200 text-gray-800"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {formData.sharedEducationalMaterials ? "Yes" : "No"}
                    </div>
                  </div>
                </button>

                {formData.sharedEducationalMaterials && (
                  <div className="space-y-4 pl-2 border-l-2 border-gray-200">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Upload Files (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="educational-materials-upload"
                        />
                        <label
                          htmlFor="educational-materials-upload"
                          className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <Upload className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">Choose files to upload</span>
                        </label>
                      </div>
                      {formData.sharedEducationalMaterialsFiles && formData.sharedEducationalMaterialsFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {formData.sharedEducationalMaterialsFiles.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-600" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                  <p className="text-xs text-gray-500">{file.size}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(file.id)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                              >
                                <X className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Notes (Optional)
                      </label>
                      <Textarea
                        name="sharedEducationalMaterialsNotes"
                        value={formData.sharedEducationalMaterialsNotes || ""}
                        onChange={handleChange}
                        placeholder="Add any notes about the shared educational materials..."
                        rows={4}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => handleBooleanChange("hasCompetitorsConsidered", !formData.hasCompetitorsConsidered)}
                  className="w-full bg-gray-50 rounded-xl p-6 border border-gray-200 hover:bg-gray-100 transition-all duration-200 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        formData.hasCompetitorsConsidered
                          ? "border-gray-700 bg-gray-700"
                          : "border-gray-300 bg-white"
                      }`}>
                        {formData.hasCompetitorsConsidered && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        Competitors Considered
                      </span>
                    </div>
                    <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.hasCompetitorsConsidered
                        ? "bg-gray-200 text-gray-800"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {formData.hasCompetitorsConsidered ? "Yes" : "No"}
                    </div>
                  </div>
                </button>

                {formData.hasCompetitorsConsidered && (
                  <div className="pl-2 border-l-2 border-gray-200">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      List Competitors (Optional)
                    </label>
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
                      placeholder="Enter competitors separated by commas (e.g., Competitor A, Competitor B)"
                      rows={3}
                      className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                )}
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
