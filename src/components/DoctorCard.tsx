
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Star, Check, Info } from "lucide-react";

interface DoctorProps {
  doctor: {
    id: string;
    name: string;
    specialty: string;
    experience: number;
    rating: number;
    location: string;
    availability: string;
  };
}

export const DoctorCard = ({ doctor }: DoctorProps) => {
  // Create star rating display
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index}
        className={`h-4 w-4 ${index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ));
  };
  
  const renderPrice = () => {
    if (doctor.rating > 4.5) return "₹499";
    else if (doctor.rating > 4) return "₹399";
    else if (doctor.rating > 3.5) return "₹350";
    return "₹299";
  };
  
  const renderCashback = () => {
    if (doctor.rating > 4.5) return null;
    if (doctor.rating > 4) return { amount: "₹60", icon: "🪙" };
    if (doctor.rating > 3.5) return { amount: "₹53", icon: "🪙" };
    return { amount: "₹50", icon: "🪙" };
  };
  
  const cashback = renderCashback();
  
  // Derive qualification from specialty
  const getQualification = (specialty: string) => {
    if (specialty.includes("Internal Medicine")) {
      return "MBBS, MD (INTERNAL MEDICINE)";
    }
    if (specialty.includes("Pathology")) {
      return "MBBS, MD (PATHOLOGY)";
    }
    return "MBBS";
  };
  
  // Calculate years of experience
  const getYearsOfExperience = (exp: number) => {
    if (exp > 10) return "10 YEARS";
    if (exp > 5) return "5 YEARS";
    return "3 YEARS";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Doctor Info Section */}
        <div className="flex-1 p-4">
          <div className="flex gap-4">
            {/* Doctor Image */}
            <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-xl">DR</span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">Dr. {doctor.name}</h2>
                    <Info className="h-4 w-4 text-gray-400" />
                    
                    {doctor.rating > 4.5 && (
                      <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded">
                        DOCTOR OF THE HOUR
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">{doctor.specialty}</p>
                  
                  <div className="flex items-center gap-1 mt-2 text-xs text-blue-600 font-medium">
                    <span>{getYearsOfExperience(doctor.experience)}</span>
                    <span className="text-gray-400">•</span>
                    <span>{getQualification(doctor.specialty)}</span>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    <div>{doctor.location}</div>
                    <div className="mt-1">Apollo 24|7 Virtual Clinic - {doctor.location}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold">{renderPrice()}</div>
                  
                  {cashback && (
                    <div className="flex items-center justify-end text-xs mt-1">
                      <span className="mr-1">{cashback.icon}</span>
                      <span className="text-orange-500 font-medium">{cashback.amount} Cashback</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking Section */}
        <div className="p-4 bg-gray-50 md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-200">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Consult Online
          </Button>
          
          <div className="text-xs text-center text-gray-500 mt-2">
            Available in 4 minutes
          </div>
        </div>
      </div>
    </div>
  );
};
