
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, User, Menu } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-blue-600 font-bold text-xl">Apollo247</div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <a href="#" className="text-gray-700 hover:text-blue-600">Doctors</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Pharmacy</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Lab Tests</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Health Records</a>
            </nav>
            
            {/* Search Bar */}
            <div className="relative w-64">
              <Input 
                type="text" 
                placeholder="Search for doctors, specialties..." 
                className="pl-9 pr-4 py-2"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
