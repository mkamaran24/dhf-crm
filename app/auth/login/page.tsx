
"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialButton } from "@/components/MaterialButton";
import { MaterialFloatingInput } from "@/components/MaterialFloatingInput";
import { Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Redirect logic would go here
    window.location.href = "/dashboard"; 
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Column - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
        </div>
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
             <span className="text-2xl font-bold text-white">D</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">DHF CRM</h1>
          <p className="text-blue-100 text-lg max-w-md leading-relaxed">
            The complete solution for managing patient journeys, appointments, and clinical workflows efficiently.
          </p>
        </div>

        <div className="relative z-10 text-xs text-blue-200/60 font-medium">
           DENTAL HEALTH CARE CRM v1.0
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 bg-gray-50/50">
         <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo (Visible only on mobile) */}
            <div className="lg:hidden flex flex-col items-center mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-blue-600/30">
                    <span className="text-2xl font-bold text-white">D</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">DHF CRM</h1>
            </div>

            {/* Login Card */}
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100/50 animate-fade-in">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
                    <p className="text-sm text-gray-500 mt-2">Please enter your details to sign in</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <MaterialFloatingInput
                            label="Email Address"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                         <MaterialFloatingInput
                            label="Password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-gray-500">Remember me</span>
                        </label>
                        <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <MaterialButton 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:scale-[1.02] transition-all duration-200"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
                        {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                    </MaterialButton>
                </form>
            </div>

            {/* Footer */}
            <div className="text-center">
                 <p className="text-xs text-gray-400">
                    &copy; 2025 DHF CRM. All rights reserved.
                </p>
                <div className="mt-4 flex justify-center gap-4 text-xs text-gray-400">
                    <Link href="#" className="hover:text-gray-600">Privacy Policy</Link>
                    <span>•</span>
                    <Link href="#" className="hover:text-gray-600">Terms of Service</Link>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
