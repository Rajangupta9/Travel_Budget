import React, { useState } from "react";
import { X, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const TripModal = ({
  showAddTripModal,
  setShowAddTripModal,
  newTrip,
  setNewTrip,
  handleAddTrip,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  if (!showAddTripModal) return null;

  const handleDateSelect = (date) => {
    if (!startDate || (startDate && endDate)) {
      // Starting a new selection
      setStartDate(date);
      setEndDate(null);
    } else {
      // Completing a selection
      if (date >= startDate) {
        setEndDate(date);
        
        // Format dates for display
        const start = new Date(startDate);
        const end = new Date(date);
        const formattedStartDate = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const formattedEndDate = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const dateRange = `${formattedStartDate} - ${formattedEndDate}`;
        
        setNewTrip({ ...newTrip, dates: dateRange });
        setShowDatePicker(false);
      } else {
        // If end date is before start date, reset selection
        setStartDate(date);
        setEndDate(null);
      }
    }
  };

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate calendar days with the updated month and year
  const generateCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isSelected = 
        (startDate && date.toDateString() === new Date(startDate).toDateString()) || 
        (endDate && date.toDateString() === new Date(endDate).toDateString());
      const isInRange = 
        startDate && 
        !endDate && 
        date > new Date(startDate) && 
        date < new Date(); // Only mark dates between start date and today
      
      const isInSelectedRange = 
        startDate && 
        endDate && 
        date > new Date(startDate) && 
        date < new Date(endDate);
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(date)}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
            isSelected 
              ? 'bg-indigo-600 text-white' 
              : isInSelectedRange || isInRange
                ? 'bg-indigo-100' 
                : 'hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  // Get month name
  const getMonthName = () => {
    return new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Add New Trip</h2>
          <button onClick={() => setShowAddTripModal(false)} className="p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleAddTrip}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trip Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newTrip.name}
              onChange={(e) =>
                setNewTrip({ ...newTrip, name: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dates
            </label>
            <div
              className="w-full p-2 border border-gray-300 rounded-md flex items-center cursor-pointer"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar size={16} className="text-gray-400 mr-2" />
              <span className={newTrip.dates ? 'text-gray-900' : 'text-gray-400'}>
                {newTrip.dates || "Select trip dates"}
              </span>
            </div>
            
            {showDatePicker && (
              <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 w-72">
                <div className="mb-2 flex justify-between items-center">
                  <div className="text-sm font-medium">
                    {startDate ? (
                      <div>
                        <div>Start: {formatDateForDisplay(startDate)}</div>
                        {endDate && <div>End: {formatDateForDisplay(endDate)}</div>}
                      </div>
                    ) : (
                      "Select start date"
                    )}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowDatePicker(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {/* Month and Year Navigation */}
                <div className="flex justify-between items-center mb-2">
                  <button 
                    type="button" 
                    onClick={goToPreviousMonth}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="font-medium">
                    {getMonthName()} {currentYear}
                  </div>
                  <button 
                    type="button" 
                    onClick={goToNextMonth}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-gray-500 text-center">
                  <div>Su</div>
                  <div>Mo</div>
                  <div>Tu</div>
                  <div>We</div>
                  <div>Th</div>
                  <div>Fr</div>
                  <div>Sa</div>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays()}
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget ($)
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newTrip.budget}
              onChange={(e) =>
                setNewTrip({ ...newTrip, budget: e.target.value })
              }
              min="1"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddTripModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripModal;