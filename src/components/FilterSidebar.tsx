
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  currentFilters: {
    specialty: string;
    location: string;
    experience: number;
    rating: number;
    gender: string;
    consultMode: string[];
    fees: string[];
    language: string[];
    facility: string[];
    availability: string[];
  };
}

export const FilterSidebar = ({ onFilterChange, currentFilters }: FilterSidebarProps) => {
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [filters, setFilters] = useState(currentFilters);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    experience: true,
    fees: true,
    language: true,
    facility: true,
    gender: true,
    availability: true
  });

  useEffect(() => {
    fetchSpecialties();
    fetchLocations();
    fetchLanguages();
    fetchFacilities();
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

  const fetchLanguages = async () => {
    const { data, error } = await supabase
      .from("doctors")
      .select("languages");
      
    if (error) {
      console.error("Error fetching languages:", error);
      return;
    }
    
    // Extract unique languages from array fields
    const allLanguages = data.flatMap(item => item.languages || []);
    const uniqueLanguages = [...new Set(allLanguages)].filter(Boolean);
    setLanguages(uniqueLanguages);
  };

  const fetchFacilities = async () => {
    const { data, error } = await supabase
      .from("doctors")
      .select("clinic_name");
      
    if (error) {
      console.error("Error fetching facilities:", error);
      return;
    }
    
    // Extract unique clinic names
    const uniqueFacilities = [...new Set(data.map(item => item.clinic_name))].filter(Boolean);
    setFacilities(uniqueFacilities);
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

  const handleGenderChange = (gender: string) => {
    const newFilters = { ...filters, gender };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAvailabilityChange = (day: string) => {
    const availability = [...filters.availability];
    const index = availability.indexOf(day);
    
    if (index === -1) {
      availability.push(day);
    } else {
      availability.splice(index, 1);
    }
    
    const newFilters = { ...filters, availability };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      specialty: "",
      location: "",
      experience: 0,
      rating: 0,
      gender: "",
      consultMode: [],
      fees: [],
      language: [],
      facility: [],
      availability: []
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };
  
  const toggleExpand = (section: string) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
          <div className="flex items-center gap-2">
            <Checkbox 
              id="home-visit" 
              checked={filters.consultMode.includes("home")}
              onCheckedChange={() => handleConsultModeChange("home")}
            />
            <Label htmlFor="home-visit">Home Visit</Label>
          </div>
        </div>
      </div>

      {/* Gender */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExpand('gender')}>
          <h3 className="text-base font-medium">Gender</h3>
          <span>{expanded.gender ? '−' : '+'}</span>
        </div>
        {expanded.gender && (
          <div className="mt-3">
            <RadioGroup 
              value={filters.gender} 
              onValueChange={handleGenderChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Male" id="gender-male" />
                <Label htmlFor="gender-male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Female" id="gender-female" />
                <Label htmlFor="gender-female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Other" id="gender-other" />
                <Label htmlFor="gender-other">Other</Label>
              </div>
            </RadioGroup>
          </div>
        )}
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
              <Label htmlFor="exp-11-15">11-15</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="exp-16-20" 
                checked={filters.experience === 20}
                onCheckedChange={() => handleExperienceChange(filters.experience === 20 ? 0 : 20)}
              />
              <Label htmlFor="exp-16-20">16-20</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="exp-20+" 
                checked={filters.experience === 25}
                onCheckedChange={() => handleExperienceChange(filters.experience === 25 ? 0 : 25)}
              />
              <Label htmlFor="exp-20+">20+</Label>
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
                id="fees-100-300" 
                checked={filters.fees.includes("100-300")}
                onCheckedChange={() => handleFeesChange("100-300")}
              />
              <Label htmlFor="fees-100-300">₹100-₹300</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="fees-300-500" 
                checked={filters.fees.includes("300-500")}
                onCheckedChange={() => handleFeesChange("300-500")}
              />
              <Label htmlFor="fees-300-500">₹300-₹500</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="fees-500-800" 
                checked={filters.fees.includes("500-800")}
                onCheckedChange={() => handleFeesChange("500-800")}
              />
              <Label htmlFor="fees-500-800">₹500-₹800</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="fees-800-1000" 
                checked={filters.fees.includes("800-1000")}
                onCheckedChange={() => handleFeesChange("800-1000")}
              />
              <Label htmlFor="fees-800-1000">₹800-₹1000</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="fees-1000+" 
                checked={filters.fees.includes("1000+")}
                onCheckedChange={() => handleFeesChange("1000+")}
              />
              <Label htmlFor="fees-1000+">₹1000+</Label>
            </div>
          </div>
        )}
      </div>
      
      {/* Availability */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExpand('availability')}>
          <h3 className="text-base font-medium">Availability</h3>
          <span>{expanded.availability ? '−' : '+'}</span>
        </div>
        {expanded.availability && (
          <div className="space-y-2 mt-3">
            {weekDays.map(day => (
              <div key={day} className="flex items-center gap-2">
                <Checkbox 
                  id={`day-${day.toLowerCase()}`} 
                  checked={filters.availability.includes(day)}
                  onCheckedChange={() => handleAvailabilityChange(day)}
                />
                <Label htmlFor={`day-${day.toLowerCase()}`}>{day}</Label>
              </div>
            ))}
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
            {languages.map(language => (
              <div key={language} className="flex items-center gap-2">
                <Checkbox 
                  id={`lang-${language.toLowerCase()}`} 
                  checked={filters.language.includes(language)}
                  onCheckedChange={() => handleLanguageChange(language)}
                />
                <Label htmlFor={`lang-${language.toLowerCase()}`}>{language}</Label>
              </div>
            ))}
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
            {facilities.map(facility => (
              <div key={facility} className="flex items-center gap-2">
                <Checkbox 
                  id={`facility-${facility.toLowerCase().replace(/\s+/g, '-')}`} 
                  checked={filters.facility.includes(facility)}
                  onCheckedChange={() => handleFacilityChange(facility)}
                />
                <Label htmlFor={`facility-${facility.toLowerCase().replace(/\s+/g, '-')}`}>{facility}</Label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
