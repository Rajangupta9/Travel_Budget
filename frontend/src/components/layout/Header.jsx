import React, { useMemo } from "react";
import { Plus, Calendar, FileText, MapPin, Globe, DollarSign, User, TrendingUp, Clock, AlertTriangle } from "lucide-react";

const Header = ({ 
  activeTrip, 
  activeTripDates,
  setShowAddExpenseModal,
  user,
  upcomingTrips,
  currentTripData
}) => {
  // Get current trip data based on activeTrip name
  const tripData = useMemo(() => {
    if (!upcomingTrips || !activeTrip) return null;
    return upcomingTrips.find(trip => trip.name === activeTrip);
  }, [upcomingTrips, activeTrip]);

  // Get current date in a formatted string
  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate budget information with more metrics
  const budgetInfo = useMemo(() => {
    
    if (!tripData) return null;

    const totalBudget = tripData.budget || 0;
    const remainingBudget = tripData.remainingBudget || 0;
    const spentBudget = totalBudget - remainingBudget;
    
    // Calculate percentage values
    const spentPercentage = totalBudget > 0 ? Math.min(100, (spentBudget / totalBudget) * 100) : 0;
    const remainingPercentage = 100 - spentPercentage;
    
    // Determine status color based on remaining budget percentage
    let statusColor = "bg-green-500"; // Default: Good (> 50%)
    let statusText = "On Track";
    
    if (remainingPercentage < 25) {
      statusColor = "bg-red-500"; // Critical (< 25%)
      statusText = "Critical";
    } else if (remainingPercentage < 50) {
      statusColor = "bg-yellow-500"; // Warning (< 50%)
      statusText = "Warning";
    }

    // Calculate days elapsed and remaining
    let daysElapsed = 0;
    let daysRemaining = 0;
    let burnRate = 0;
    
    if (tripData.dates) {
      const [startDateStr, endDateStr] = tripData.dates.split(' - ');
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      const today = new Date();
      
      const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      daysElapsed = Math.max(0, Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)));
      daysRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
      
      // Calculate burn rate (budget used per elapsed percentage)
      const elapsedPercentage = totalDays > 0 ? (daysElapsed / totalDays) * 100 : 0;
      burnRate = elapsedPercentage > 0 ? spentPercentage / elapsedPercentage : 0;
    }

    return {
      total: totalBudget,
      remaining: remainingBudget,
      spent: spentBudget,
      remainingPercentage,
      spentPercentage,
      statusColor,
      statusText,
      daysElapsed,
      daysRemaining,
      burnRate
    };
  }, [tripData]);

  // Daily average calculations from currentTripData
  const dailyMetrics = useMemo(() => {
    if (!currentTripData) return null;
    
    return {
      dailyAverage: currentTripData.dailyAverage || 0,
      dailyTarget: currentTripData.dailyTarget || 0,
      daysRemaining: currentTripData.daysRemaining || 0
    };
  }, [currentTripData]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      {/* Main header with trip info and actions */}
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left section: Trip title and details */}
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <Globe className="mr-2 text-indigo-600" size={22} />
            <h1 className="text-xl font-bold text-gray-900">
              {activeTrip || "My Trips"}
            </h1>
            
            {tripData && tripData.status && (
              <span className={`ml-3 px-2 py-0.5 text-xs font-medium rounded-full ${
                tripData.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : tripData.status === 'Upcoming' 
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
              }`}>
                {tripData.status}
              </span>
            )}
          </div>
          
          {/* Trip dates with icon */}
          {activeTrip && activeTripDates && (
            <div className="flex items-center mr-4 bg-gray-100 px-3 py-1 rounded-md">
              <Calendar size={16} className="mr-1.5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">{activeTripDates}</span>
            </div>
          )}
          
          {/* Current date */}
          <div className="hidden md:flex items-center text-sm text-gray-500">
            <Clock size={16} className="mr-1.5 text-gray-400" />
            <span>{getCurrentDate()}</span>
          </div>
        </div>
        
        {/* Right section: User info and action buttons */}
        <div className="flex items-center">
          {/* User info */}
          {user && (
            <div className="flex items-center mr-6 pr-6 border-r border-gray-200">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold mr-2">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800">{user.name}</span>
                {user.planType && (
                  <span className={`text-xs ${
                    user.planType === 'premium' 
                      ? 'text-yellow-600' 
                      : 'text-gray-500'
                  }`}>
                    {user.planType === 'premium' ? 'Premium Plan' : 'Basic Plan'}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            <button className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center shadow-sm">
              <FileText size={16} className="mr-1.5" />
              <span>Export</span>
            </button>
            
            <button
              className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center shadow-sm"
              onClick={() => activeTrip && setShowAddExpenseModal(true)}
              disabled={!activeTrip}
            >
              <Plus size={16} className="mr-1" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Budget status bar */}
      {activeTrip && budgetInfo && (
        <div className="px-6 py-3 bg-gray-50 flex flex-wrap items-center justify-between">
          <div className="flex items-center">
            <DollarSign size={16} className="mr-1 text-indigo-600" />
            <span className="text-sm font-semibold text-gray-800 mr-2">
              Budget Overview:
            </span>
            
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">
                {formatCurrency(budgetInfo.spent)} of {formatCurrency(budgetInfo.total)}
              </span>
              
              <div className="mx-3 w-40 bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`${budgetInfo.statusColor} h-2.5 rounded-full`}
                  style={{ width: `${budgetInfo.spentPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {formatCurrency(budgetInfo.remaining)} remaining
                </span>
                <span className={`text-xs ${
                  budgetInfo.remainingPercentage < 25 ? 'text-red-600' : 
                  budgetInfo.remainingPercentage < 50 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {budgetInfo.remainingPercentage.toFixed(0)}% ({budgetInfo.statusText})
                </span>
              </div>
            </div>
          </div>
          
          {/* Trip metrics */}
          <div className="flex items-center space-x-6">
            {budgetInfo.daysElapsed > 0 && (
              <div className="flex items-center">
                <Calendar size={16} className="mr-1.5 text-indigo-600" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Trip Progress</span>
                  <span className="text-sm font-medium">
                    Day {budgetInfo.daysElapsed}{budgetInfo.daysRemaining > 0 ? ` (${budgetInfo.daysRemaining} left)` : ''}
                  </span>
                </div>
              </div>
            )}
            
            {tripData && tripData.dailyAverage && (
              <div className="flex items-center">
                <TrendingUp size={16} className="mr-1.5 text-indigo-600" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Daily Average</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(tripData.dailyAverage)}
                    {dailyMetrics && dailyMetrics.dailyTarget > 0 && (
                      <span className="text-xs text-gray-500 ml-1">
                        / {formatCurrency(dailyMetrics.dailyTarget)} target
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}
            
            {budgetInfo.burnRate > 0 && (
              <div className="flex items-center">
                <DollarSign size={16} className="mr-1.5 text-indigo-600" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Spend Rate</span>
                  <span className={`text-sm font-medium ${
                    budgetInfo.burnRate > 1.1 ? 'text-red-600' : 
                    budgetInfo.burnRate > 0.9 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {(budgetInfo.burnRate * 100).toFixed(0)}% of pace
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Alert for over budget trips */}
      {tripData && tripData.remainingBudget < 0 && (
        <div className="px-6 py-2 bg-red-50 border-t border-red-100 flex items-center">
          <AlertTriangle size={16} className="mr-2 text-red-500" />
          <span className="text-sm text-red-700 font-medium">
            You are {formatCurrency(Math.abs(tripData.remainingBudget))} over budget for this trip!
          </span>
        </div>
      )}
      
      {/* Daily average spending if trip is active */}
      {tripData && tripData.status === 'Active' && tripData.dailyAverage && (
        <div className="px-6 py-2 bg-indigo-50 border-t border-indigo-100 flex justify-between items-center">
          <div className="text-sm text-indigo-700">
            {budgetInfo && budgetInfo.daysRemaining > 0 ? (
              <span>Estimated remaining spend: {formatCurrency(dailyMetrics?.dailyAverage * budgetInfo.daysRemaining)}</span>
            ) : (
              <span>Keep tracking your expenses until the end of your trip</span>
            )}
          </div>
          
          <div className="flex items-center text-sm">
            <span className="text-indigo-700 font-medium mr-1">Daily average:</span>
            <span className="text-indigo-900">{formatCurrency(tripData.dailyAverage)}</span>
            {dailyMetrics && dailyMetrics.dailyTarget > 0 && (
              <span className="text-indigo-500 ml-2">
                / {formatCurrency(dailyMetrics.dailyTarget)} per day
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;