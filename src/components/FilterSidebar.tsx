
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  currentFilters: {
    specialty: string;
    location: string;
    experience: number;
    rating: number;
    consultMode: string[];
    fees: string[];
    language: string[];
    facility: string[];
  };
}

export const FilterSidebar = ({ onFilterChange, currentFilters }: FilterSidebarProps) => {
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [filters, setFilters] = useState(currentFilters);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    experience: true,
    fees: true,
    language: true,
    facility: true
  });

  useEffect(() => {
    fetchSpecialties();
    fetchLocations();
  }, []);

  const fetchSpecialties = async () => {
    const { data, error } = await supabase
      .from("doctors")
      .select("specialty")
      .order("specialty");
      
    if (error) {
      console.error("Error fetching specialties:", error);
      return;
    }
    
    // Extract unique specialties
    const uniqueSpecialties = [...new Set(data.map(item => item.specialty))];
    setSpecialties(uniqueSpecialties);
  };

  const fetchLocations = async () => {
    const { data, error } = await supabase
      .from("doctors")
      .select("location")
      .order("location");
      
    if (error) {
      console.error("Error fetching locations:", error);
      return;
    }
    
    // Extract unique locations
    const uniqueLocations = [...new Set(data.map(item => item.location))];
    setLocations(uniqueLocations);
  };
  
  const handleConsultModeChange = (mode: string) => {
    const consultMode = [...filters.consultMode];
    const index = consultMode.indexOf(mode);
    
    if (index === -1) {
      consultMode.push(mode);
    } else {
      consultMode.splice(index, 1);
    }
    
    const newFilters = { ...filters, consultMode };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleExperienceChange = (years: number) => {
    const newFilters = { ...filters, experience: years };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleFeesChange = (range: string) => {
    const fees = [...filters.fees];
    const index = fees.indexOf(range);
    
    if (index === -1) {
      fees.push(range);
    } else {
      fees.splice(index, 1);
    }
    
    const newFilters = { ...filters, fees };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleLanguageChange = (language: string) => {
    const languages = [...filters.language];
    const index = languages.indexOf(language);
    
    if (index === -1) {
      languages.push(language);
    } else {
      languages.splice(index, 1);
    }
    
    const newFilters = { ...filters, language: languages };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleFacilityChange = (facility: string) => {
    const facilities = [...filters.facility];
    const index = facilities.indexOf(facility);
    
    if (index === -1) {
      facilities.push(facility);
    } else {
      facilities.splice(index, 1);
    }
    
    const newFilters = { ...filters, facility: facilities };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      specialty: "",
      location: "",
      experience: 0,
      rating: 0,
      consultMode: [],
      fees: [],
      language: [],
      facility: []
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };
  
  const toggleExpand = (section: string) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-6 bg-white p-4 rounded-md shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        <button 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium" 
          onClick={clearFilters}
        >
          Clear All
        </button>
      </div>
      
      {/* Near Me Button */}
      <div>
        <Button variant="outline" className="w-full justify-center border-blue-600 text-blue-600">
          Show Doctors Near Me
        </Button>
      </div>
      
      {/* Mode of Consult */}
      <div className="border-t pt-4">
        <h3 className="text-base font-medium mb-3">Mode of Consult</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="hospital-visit" 
              checked={filters.consultMode.includes("hospital")}
              onCheckedChange={() => handleConsultModeChange("hospital")}
            />
            <Label htmlFor="hospital-visit">Hospital Visit</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="online-consult" 
              checked={filters.consultMode.includes("online")}
              onCheckedChange={() => handleConsultModeChange("online")}
            />
            <Label htmlFor="online-consult">Online Consult</Label>
          </div>
        </div>
      </div>
      
      {/* Experience */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExpand('experience')}>
          <h3 className="text-base font-medium">Experience (In Years)</h3>
          <span>{expanded.experience ? '−' : '+'}</span>
        </div>
        {expanded.experience && (
          <div className="space-y-2 mt-3">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="exp-0-5" 
                checked={filters.experience === 5}
                onCheckedChange={() => handleExperienceChange(filters.experience === 5 ? 0 : 5)}
              />
              <Label htmlFor="exp-0-5">0-5</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="exp-6-10" 
                checked={filters.experience === 10}
                onCheckedChange={() => handleExperienceChange(filters.experience === 10 ? 0 : 10)}
              />
              <Label htmlFor="exp-6-10">6-10</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="exp-11-15" 
                checked={filters.experience === 15}
                onCheckedChange={() => handleExperienceChange(filters.experience === 15 ? 0 : 15)}
              />
              <Label htmlFor="exp-11-15">11-16</Label>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <span className="text-sm font-medium">+1 More</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Fees */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExpand('fees')}>
          <h3 className="text-base font-medium">Fees (In Rupees)</h3>
          <span>{expanded.fees ? '−' : '+'}</span>
        </div>
        {expanded.fees && (
          <div className="space-y-2 mt-3">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="fees-100-500" 
                checked={filters.fees.includes("100-500")}
                onCheckedChange={() => handleFeesChange("100-500")}
              />
              <Label htmlFor="fees-100-500">100-500</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="fees-500-1000" 
                checked={filters.fees.includes("500-1000")}
                onCheckedChange={() => handleFeesChange("500-1000")}
              />
              <Label htmlFor="fees-500-1000">500-1000</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="fees-1000+" 
                checked={filters.fees.includes("1000+")}
                onCheckedChange={() => handleFeesChange("1000+")}
              />
              <Label htmlFor="fees-1000+">1000+</Label>
            </div>
          </div>
        )}
      </div>
      
      {/* Language */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExpand('language')}>
          <h3 className="text-base font-medium">Language</h3>
          <span>{expanded.language ? '−' : '+'}</span>
        </div>
        {expanded.language && (
          <div className="space-y-2 mt-3">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="lang-english" 
                checked={filters.language.includes("English")}
                onCheckedChange={() => handleLanguageChange("English")}
              />
              <Label htmlFor="lang-english">English</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="lang-hindi" 
                checked={filters.language.includes("Hindi")}
                onCheckedChange={() => handleLanguageChange("Hindi")}
              />
              <Label htmlFor="lang-hindi">Hindi</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="lang-telugu" 
                checked={filters.language.includes("Telugu")}
                onCheckedChange={() => handleLanguageChange("Telugu")}
              />
              <Label htmlFor="lang-telugu">Telugu</Label>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <span className="text-sm font-medium">+10 More</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Facility */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExpand('facility')}>
          <h3 className="text-base font-medium">Facility</h3>
          <span>{expanded.facility ? '−' : '+'}</span>
        </div>
        {expanded.facility && (
          <div className="space-y-2 mt-3">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="facility-apollo" 
                checked={filters.facility.includes("Apollo Hospital")}
                onCheckedChange={() => handleFacilityChange("Apollo Hospital")}
              />
              <Label htmlFor="facility-apollo">Apollo Hospital</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="facility-other" 
                checked={filters.facility.includes("Other Clinics")}
                onCheckedChange={() => handleFacilityChange("Other Clinics")}
              />
              <Label htmlFor="facility-other">Other Clinics</Label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
