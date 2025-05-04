
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="bg-white shadow-sm">
      {/* Top navigation bar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 py-2">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-blue-600 font-bold text-2xl flex items-center">
              <span className="text-teal-500">Apollo</span>
              <span className="bg-orange-500 text-white px-1 rounded">24|7</span>
            </div>
          </div>
          
          {/* Location Selector */}
          <div className="hidden md:flex items-center gap-2 mx-4">
            <MapPin className="h-5 w-5 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Select Location</div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Select Address</span>
                <span className="text-gray-500">▼</span>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Search Doctors, Specialities, Conditions etc." 
                  className="pl-10 pr-4 py-2 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button 
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 h-7"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
          
          {/* Login Button */}
          <div>
            <Button variant="outline" className="border-2 border-blue-600 text-blue-600 font-medium">
              Login
            </Button>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex overflow-x-auto space-x-6 py-3">
            <a href="#" className="text-gray-700 hover:text-blue-600 whitespace-nowrap">Buy Medicines</a>
            <a href="#" className="text-blue-600 font-medium whitespace-nowrap">Find Doctors</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 whitespace-nowrap">Lab Tests</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 whitespace-nowrap">Circle Membership</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 whitespace-nowrap">Health Records</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 whitespace-nowrap">Diabetes Reversal</a>
            <div className="flex items-center">
              <a href="#" className="text-gray-700 hover:text-blue-600 whitespace-nowrap">Buy Insurance</a>
              <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 rounded">New</span>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};
