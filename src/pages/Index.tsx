
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

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  location: string;
  availability: string;
}

const Index = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [filters, setFilters] = useState({
    specialty: "",
    location: "",
    experience: 0,
    rating: 0,
    consultMode: [] as string[],
    fees: [] as string[],
    language: [] as string[],
    facility: [] as string[]
  });
  const [sortBy, setSortBy] = useState("rating");
  const itemsPerPage = 5;

  useEffect(() => {
    fetchDoctors();
  }, [currentPage, filters, sortBy]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      
      // Start building the query
      let query = supabase
        .from("doctors")
        .select("*", { count: "exact" });
      
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
      
      setDoctors(data || []);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
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
              <div className="relative inline-block">
                <div className="flex items-center gap-2 border rounded-md p-2 cursor-pointer bg-white">
                  <span className="font-medium">Relevance</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
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
