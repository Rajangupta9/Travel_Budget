import React, { useState, useEffect } from "react";
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
  Trash2,
  IndianRupee,
  FileText
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({
  isSidebarOpen,
  toggleSidebar,
  upcomingTrips,
  activeTrip,
  setActiveTrip,
  setShowAddTripModal,
  user,
  handleDeleteTrip,
  handleViewAllExpenses
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showCurrencyConverter, setShowCurrencyConverter] = useState(false);
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  
  // Navigation items configuration
  const navigationItems = [
    { name: "Dashboard", icon: <Compass size={20} />, path: "/dashboard" },
    { name: "Expenses", icon: <CreditCard size={20} />, path: "/expenses" },
    { name: "Trip Planner", icon: <Calendar size={20} />, path: "/trip-planner" },
    { name: "Destinations", icon: <Map size={20} />, path: "/destinations" },
    { name: "Reports", icon: <TrendingUp size={20} />, path: "/reports" },
  ];
  
  // Sample exchange rates (in a real app, fetch these from an API)
  const exchangeRates = {
    USD: { EUR: 0.93, GBP: 0.79, JPY: 151.72, CAD: 1.37, AUD: 1.52, INR: 83.42 },
    EUR: { USD: 1.08, GBP: 0.85, JPY: 163.34, CAD: 1.47, AUD: 1.64, INR: 89.74 },
    GBP: { USD: 1.27, EUR: 1.18, JPY: 193.04, CAD: 1.74, AUD: 1.94, INR: 106.10 },
    JPY: { USD: 0.0066, EUR: 0.0061, GBP: 0.0052, CAD: 0.009, AUD: 0.01, INR: 0.55 },
    CAD: { USD: 0.73, EUR: 0.68, GBP: 0.57, JPY: 110.89, AUD: 1.11, INR: 60.96 },
    AUD: { USD: 0.66, EUR: 0.61, GBP: 0.52, JPY: 99.93, CAD: 0.9, INR: 54.93 },
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0094, JPY: 1.82, CAD: 0.016, AUD: 0.018 }
  };

  // Handle page navigation
  const navigateTo = (path) => {
    navigate(path);
  };

  // Check if the current route matches a navigation item
  const isActive = (path) => {
    return location.pathname === path;
  };

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

  const handleConvert = () => {
    if (amount && fromCurrency && toCurrency) {
      const rate = exchangeRates[fromCurrency][toCurrency];
      const result = parseFloat(amount) * rate;
      setConvertedAmount(result.toFixed(2));
    }
  };

  return (
    <div
      className={`bg-indigo-800 text-white ${
        isSidebarOpen ? "w-64" : "w-20"
      } transition-all duration-300 flex flex-col h-screen`}
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
            {/* Dynamic Navigation Items */}
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                className={`w-full flex items-center px-4 py-3 rounded-lg ${
                  isActive(item.path)
                    ? "text-white bg-indigo-700"
                    : "text-indigo-100 hover:bg-indigo-700"
                }`}
              >
                {item.icon}
                {isSidebarOpen && <span className="ml-3">{item.name}</span>}
              </button>
            ))}
            
            {/* View All Expenses Button */}
            <button
              onClick={handleViewAllExpenses}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-700`}
            >
              <FileText size={20} />
              {isSidebarOpen && <span className="ml-3">All Expenses</span>}
            </button>
            
            {/* Currency Converter Button */}
            <button
              onClick={() => setShowCurrencyConverter(!showCurrencyConverter)}
              className="w-full flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-700 rounded-lg"
            >
              <IndianRupee size={20} />
              {isSidebarOpen && <span className="ml-3">Currency Converter</span>}
            </button>
          </div>

          {/* Currency Converter */}
          {isSidebarOpen && showCurrencyConverter && (
            <div className="mt-4 p-3 bg-indigo-700 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Currency Converter</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-full p-2 text-sm rounded bg-indigo-600 text-white placeholder-indigo-300 border border-indigo-500"
                />
                
                <div className="flex space-x-2">
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-1/2 p-2 text-sm rounded bg-indigo-600 text-white border border-indigo-500"
                  >
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                  
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-1/2 p-2 text-sm rounded bg-indigo-600 text-white border border-indigo-500"
                  >
                    <option value="INR">INR</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
                
                <button
                  onClick={handleConvert}
                  className="w-full p-2 text-sm rounded bg-indigo-500 hover:bg-indigo-400 transition-colors"
                >
                  Convert
                </button>
                
                {convertedAmount !== null && (
                  <div className="mt-2 text-center p-2 bg-indigo-600 rounded">
                    <span className="text-sm font-medium">
                      {amount} {fromCurrency} = {convertedAmount} {toCurrency}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {isSidebarOpen && (
            <div className="mt-8">
              <h2 className="px-4 text-xs font-semibold text-indigo-200 uppercase tracking-wider">
                My Trips
              </h2>
              <div className="mt-2 space-y-1">
                {upcomingTrips && upcomingTrips.length > 0 ? (
                  upcomingTrips.map((trip) => (
                    <div
                      key={trip.id || trip.name}
                      className={`flex items-center justify-between px-4 py-2 text-sm rounded-lg ${
                        trip.name === activeTrip
                          ? "bg-indigo-600 text-white"
                          : "text-indigo-100 hover:bg-indigo-700"
                      }`}
                    >
                      <button
                        className="text-left truncate flex-grow"
                        onClick={() => setActiveTrip(trip.name)}
                      >
                        <span>{trip.name}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete "${trip.name}"?`)) {
                            handleDeleteTrip(trip.id || trip.name);
                          }
                        }}
                        className="ml-2 text-indigo-300 hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-indigo-300">
                    No trips added yet
                  </div>
                )}

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