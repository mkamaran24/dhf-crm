"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/src/shared/components/ui";

export function Topbar() {
  return (
    <header className="h-16 bg-white shadow-sm fixed top-0 right-0 left-72 z-10 flex items-center justify-between px-8 border-b border-gray-100 transition-all duration-300">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="w-full max-w-md">
          <Input 
            icon={<Search className="w-4 h-4" />}
            placeholder="Search patients, leads, or records..." 
            className="bg-gray-50 border-none focus:bg-white hover:bg-gray-100 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2.5 rounded-full hover:bg-gray-50 text-gray-500 hover:text-blue-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-1 ring-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-2"></div>
        
        <button className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-gray-100">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-sm shadow-sm">
            A
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-gray-700 leading-none">Admin User</p>
            <p className="text-xs text-blue-600 mt-1 font-medium">Administrator</p>
          </div>
        </button>
      </div>
    </header>
  );
}

