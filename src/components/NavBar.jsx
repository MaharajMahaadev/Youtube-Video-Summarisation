import { Youtube } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function NavBar(){
    const navigate = useNavigate();
    
    return(
        <nav className="glass fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center text-[#FF0000] hover:opacity-80 transition-opacity">
            <Youtube size={24} />
          </a>
          <button
            onClick={() => navigate('/auth')}
            className="bg-[#FF0000] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Login / Sign Up
          </button>
        </div>
      </nav>
    )
}