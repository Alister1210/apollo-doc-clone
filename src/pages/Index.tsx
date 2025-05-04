
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { FilterSidebar } from "@/components/FilterSidebar";
import { DoctorCard } from "@/components/DoctorCard";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  location: string;
  availability: string;
  image_url?: string;
  fee?: number;
  gender?: string;
  languages?: string[];
  clinic_name?: string;
  available_days?: string[];
}

const Index = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    specialty: "",
    location: "",
    experience: 0,
    rating: 0,
    gender: "",
    consultMode: [] as string[],
    fees: [] as string[],
    language: [] as string[],
    facility: [] as string[],
    availability: [] as string[]
  });
  const [sortBy, setSortBy] = useState("rating");
  const itemsPerPage = 5;

  useEffect(() => {
    fetchDoctors();
  }, [currentPage, filters, sortBy, searchTerm]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      
      // Start building the query
      let query = supabase
        .from("doctors")
        .select("*", { count: "exact" });
      
      // Apply search term filter (search in name, specialty, location)
      if (searchTerm.trim()) {
        query = query.or(`name.ilike.%${searchTerm}%,specialty.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
      }
      
      // Apply filters
      if (filters.specialty) {
        query = query.eq("specialty", filters.specialty);
      }
      
      if (filters.location) {
        query = query.eq("location", filters.location);
      }
      
      if (filters.experience > 0) {
        query = query.gte("experience", filters.experience);
      }
      
      if (filters.rating > 0) {
        query = query.gte("rating", filters.rating);
      }
      
      if (filters.gender) {
        query = query.eq("gender", filters.gender);
      }

      // Filter by language (contains any of selected languages)
      if (filters.language.length > 0) {
        // Using containsAny for array overlap - at least one language matches
        query = query.overlaps("languages", filters.language);
      }

      // Filter by facility (clinic name)
      if (filters.facility.length > 0) {
        query = query.in("clinic_name", filters.facility);
      }

      // Filter by availability (days available) 
      if (filters.availability.length > 0) {
        // Using containsAny for array overlap - at least one day matches
        query = query.overlaps("available_days", filters.availability);
      }
      
      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      // Execute the query
      const { data, error, count } = await query
        .range(from, to)
        .order(sortBy === "rating" ? "rating" : "name", { ascending: sortBy !== "rating" });
      
      if (error) {
        console.error("Error fetching doctors:", error);
        return;
      }
      
      // Post-process for fees filtering since it's a range
      let processedData = data || [];
      
      if (filters.fees.length > 0) {
        processedData = processedData.filter(doc => {
          if (!doc.fee) return false;
          
          return filters.fees.some(feeRange => {
            if (feeRange === "100-300") return doc.fee >= 100 && doc.fee <= 300;
            if (feeRange === "300-500") return doc.fee >= 300 && doc.fee <= 500;
            if (feeRange === "500-800") return doc.fee >= 500 && doc.fee <= 800;
            if (feeRange === "800-1000") return doc.fee >= 800 && doc.fee <= 1000;
            if (feeRange === "1000+") return doc.fee >= 1000;
            return false;
          });
        });
      }
      
      setDoctors(processedData);
      if (count) {
        setTotalDoctors(count);
        setTotalPages(Math.ceil(count / itemsPerPage));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setCurrentPage(1); // Reset to first page when filters change
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "rating": return "Relevance";
      case "name": return "Name (A-Z)";
      case "experience": return "Experience";
      case "fee": return "Fee (Low to High)";
      default: return "Relevance";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearchChange} />
      
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex py-4 text-sm">
            <a href="#" className="text-blue-600 hover:underline">Home</a>
            <span className="mx-2">›</span>
            <a href="#" className="text-blue-600 hover:underline">Doctors</a>
            <span className="mx-2">›</span>
            <span className="text-gray-600">General Physicians</span>
          </nav>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className="w-full md:w-1/4">
            <FilterSidebar onFilterChange={handleFilterChange} currentFilters={filters} />
          </div>
          
          {/* Doctor Listing */}
          <div className="w-full md:w-3/4">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Consult General Physicians Online - Internal Medicine Specialists</h1>
              <p className="text-gray-600 mt-1">({totalDoctors} doctors)</p>
            </div>
            
            {/* Sort Options */}
            <div className="flex justify-end mb-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 border rounded-md p-2 cursor-pointer bg-white">
                    <span className="font-medium">{getSortLabel()}</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleSortChange("rating")}>Relevance</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange("name")}>Name (A-Z)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange("experience")}>Experience</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange("fee")}>Fee (Low to High)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {doctors.length === 0 ? (
                  <div className="bg-white rounded-lg p-6 text-center">
                    <p className="text-gray-600">No doctors found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                  </div>
                )}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        {currentPage > 1 && (
                          <PaginationItem>
                            <PaginationPrevious 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(currentPage - 1);
                              }} 
                            />
                          </PaginationItem>
                        )}
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink 
                              href="#" 
                              isActive={page === currentPage}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        {currentPage < totalPages && (
                          <PaginationItem>
                            <PaginationNext 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(currentPage + 1);
                              }} 
                            />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
