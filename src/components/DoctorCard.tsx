
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Star } from "lucide-react";

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

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Doctor Info Section */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Dr. {doctor.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{doctor.specialty}</p>
                
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {renderStars(doctor.rating)}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">{doctor.rating.toFixed(1)}</span>
                </div>
                
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{doctor.experience} Years Experience</span>
                </div>
                
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{doctor.location}</span>
                </div>
              </div>
              
              {/* Doctor Image - Placeholder */}
              <div className="hidden md:block w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
                {/* Replace with actual image if available */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-xl">DR</span>
                </div>
              </div>
            </div>
            
            {/* Availability Info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                <span className="font-medium text-blue-800">Available: {doctor.availability}</span>
              </div>
            </div>
          </div>
          
          {/* Booking Section */}
          <div className="bg-gray-50 p-6 flex flex-col justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-2">Next Available</div>
              <div className="font-medium">{doctor.availability}</div>
            </div>
            
            <div className="mt-4 space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Book Appointment
              </Button>
              <Button variant="outline" className="w-full">
                Book Video Consult
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
