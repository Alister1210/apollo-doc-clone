
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  };
}

export const FilterSidebar = ({ onFilterChange, currentFilters }: FilterSidebarProps) => {
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [filters, setFilters] = useState(currentFilters);

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

  const handleSpecialtyChange = (specialty: string) => {
    const newFilters = {
      ...filters,
      specialty: filters.specialty === specialty ? "" : specialty
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLocationChange = (location: string) => {
    const newFilters = {
      ...filters,
      location: location
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleExperienceChange = (experience: number) => {
    const newFilters = {
      ...filters,
      experience: experience
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating: number[]) => {
    const newFilters = {
      ...filters,
      rating: rating[0]
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      specialty: "",
      location: "",
      experience: 0,
      rating: 0,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="space-y-6">
      {/* Clear Filters Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        <button 
          className="text-sm text-blue-600 hover:text-blue-800" 
          onClick={clearFilters}
        >
          Clear All
        </button>
      </div>
      
      {/* Specialty Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Specialty</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {specialties.map((specialty) => (
            <div className="flex items-center space-x-2" key={specialty}>
              <Checkbox 
                id={`specialty-${specialty}`} 
                checked={filters.specialty === specialty}
                onCheckedChange={() => handleSpecialtyChange(specialty)}
              />
              <Label 
                htmlFor={`specialty-${specialty}`}
                className="text-sm"
              >
                {specialty}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Location Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Location</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={filters.location}
            onValueChange={handleLocationChange}
            className="space-y-3"
          >
            {locations.map((location) => (
              <div className="flex items-center space-x-2" key={location}>
                <RadioGroupItem value={location} id={`location-${location}`} />
                <Label 
                  htmlFor={`location-${location}`}
                  className="text-sm"
                >
                  {location}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      
      {/* Experience Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Experience (Years)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[0, 5, 10, 15, 20].map((exp) => (
              <div className="flex items-center space-x-2" key={exp}>
                <Checkbox 
                  id={`exp-${exp}`} 
                  checked={filters.experience === exp}
                  onCheckedChange={() => handleExperienceChange(exp)}
                />
                <Label 
                  htmlFor={`exp-${exp}`}
                  className="text-sm"
                >
                  {exp === 0 ? "Any" : `${exp}+ Years`}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Rating Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Slider
              defaultValue={[0]}
              max={5}
              step={1}
              value={[filters.rating]}
              onValueChange={handleRatingChange}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Any</span>
              <span>5★</span>
            </div>
            <div className="text-center font-medium">
              {filters.rating === 0 ? "Any Rating" : `${filters.rating}+ Stars`}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
