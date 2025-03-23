import React, { useState } from "react";
import {
  Compass,
  CreditCard,
  Calendar,
  Map,
  Settings,
  LogOut,
  Plus,
  TrendingUp,
  User,
  Menu,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const Sidebar = ({
  isSidebarOpen,
  toggleSidebar,
  upcomingTrips,
  activeTrip,
  setActiveTrip,
  setShowAddTripModal,
  user,
  // Remove handleLogout from props since we define it inside
}) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Define logout handler in the component
  const handleLogout = () => {
    setIsLoggingOut(true);
    
    // Simulate processing time (remove this in real implementation)
    setTimeout(() => {
      // Clear local storage
      localStorage.clear();
      
      // Navigate to auth page
      navigate('/auth');
      setIsLoggingOut(false);
      console.log("Logged out successfully");
    }, 1000); // Simulating 1 second processing
  };

  return (
    <div
      className={`bg-indigo-800 text-white ${
        isSidebarOpen ? "w-64" : "w-20"
      } transition-all duration-300 flex flex-col`}
    >
      <div className="p-5 flex items-center justify-between">
        {isSidebarOpen && <h1 className="text-xl font-bold">TravelBudget</h1>}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-indigo-700"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 pt-4">
          <div className="space-y-1">
            <a
              href="#"
              className="flex items-center px-4 py-3 text-white bg-indigo-700 rounded-lg"
            >
              <Compass size={20} />
              {isSidebarOpen && <span className="ml-3">Dashboard</span>}
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-700 rounded-lg"
            >
              <CreditCard size={20} />
              {isSidebarOpen && <span className="ml-3">Expenses</span>}
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-700 rounded-lg"
            >
              <Calendar size={20} />
              {isSidebarOpen && <span className="ml-3">Trip Planner</span>}
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-700 rounded-lg"
            >
              <Map size={20} />
              {isSidebarOpen && <span className="ml-3">Destinations</span>}
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-700 rounded-lg"
            >
              <TrendingUp size={20} />
              {isSidebarOpen && <span className="ml-3">Reports</span>}
            </a>
          </div>

          {isSidebarOpen && (
            <div className="mt-8">
              <h2 className="px-4 text-xs font-semibold text-indigo-200 uppercase tracking-wider">
                My Trips
              </h2>
              <div className="mt-2 space-y-1">
                {upcomingTrips.map((trip) => (
                  <button
                    key={trip.name}
                    className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                      trip.name === activeTrip
                        ? "bg-indigo-600 text-white"
                        : "text-indigo-100 hover:bg-indigo-700"
                    }`}
                    onClick={() => setActiveTrip(trip.name)}
                  >
                    <span className="truncate">{trip.name}</span>
                  </button>
                ))}

                <button
                  className="w-full flex items-center px-4 py-2 mt-1 text-sm text-indigo-100 hover:bg-indigo-700 rounded-lg"
                  onClick={() => setShowAddTripModal(true)}
                >
                  <Plus size={16} />
                  <span className="ml-2">New Trip</span>
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>

      <div className="p-4 mt-auto">
        <div className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-700 rounded-lg cursor-pointer">
          <Settings size={20} />
          {isSidebarOpen && <span className="ml-3">Settings</span>}
        </div>
        <div
          className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-700 rounded-lg cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {isSidebarOpen && (
            <span className="ml-3">{isLoggingOut ? "Logging out..." : "Logout"}</span>
          )}
        </div>

        {isSidebarOpen && user && (
          <div className="mt-4 pt-4 border-t border-indigo-700 flex items-center px-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <User size={16} />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {user.name || "User"}
              </p>
              <p className="text-xs text-indigo-300">
                {user.planType || "Standard"} Plan
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;