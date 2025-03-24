import React, { useState, useEffect } from "react";
import { getProfile } from "../controllers/authController";
import { useNavigate } from "react-router-dom";
import { enhancedTripService } from "./Dashboard";
import { Plus, ChevronDown, ChevronUp, Edit, Trash, Calendar } from "lucide-react";

// Import components
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import TripModal from "../components/modals/TripModel";

const TripPlanner = () => {
  // Router hooks
  const navigate = useNavigate();

  // State management
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTrip, setActiveTrip] = useState("");
  const [activeTripDates, setActiveTripDates] = useState(null);
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [showEditTripModal, setShowEditTripModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [newTrip, setNewTrip] = useState({
    name: "",
    dates: "",
    budget: "",
  });
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [expandedTrip, setExpandedTrip] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tripDetails, setTripDetails] = useState({});

  // Fetch user profile and trips data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Use actual API call when ready
        try {
            const userRes = await getProfile();
            setUser({ name: userRes.name, planType: userRes.premiumPlan });
            
            // Then fetch any other data you need for this page
            // ...
          } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to load user data. Please try again later.");
          }
        

        // Fetch trips using enhanced service
        const trips = await enhancedTripService.getTrips();

        if (trips && trips.length > 0) {
          // Sort trips by status: Active first, then Upcoming, then Past
          const sortedTrips = [...trips].sort((a, b) => {
            const statusOrder = { Active: 0, Upcoming: 1, Past: 2 };
            return statusOrder[a.status] - statusOrder[b.status];
          });

          setUpcomingTrips(sortedTrips);

          // Set active trip to the first active trip, or first trip if none are active
          const activeTrip = sortedTrips.find(
            (trip) => trip.status === "Active"
          );
          const selectedTrip = activeTrip || sortedTrips[0];

          // Set the active trip name
          setActiveTrip(selectedTrip.name);
          setActiveTripDates(selectedTrip.dates);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load your trips. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Function to handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Function to handle logout
  const handleLogout = () => {
    navigate("/login");
  };

  // Function to toggle trip details
  const toggleTripDetails = async (tripId) => {
    if (expandedTrip === tripId) {
      setExpandedTrip(null);
    } else {
      setExpandedTrip(tripId);
      
      // Fetch trip details if not already loaded
      if (!tripDetails[tripId]) {
        try {
          // This would be replaced with actual API call
          const expenses = await enhancedTripService.getExpenses(tripId);
          
          // Group expenses by category
          const categories = {};
          let totalSpent = 0;
          
          expenses.forEach(expense => {
            const amount = parseFloat(expense.amount);
            totalSpent += amount;
            
            if (!categories[expense.category]) {
              categories[expense.category] = 0;
            }
            categories[expense.category] += amount;
          });
          
          // Format category data
          const categoryData = Object.keys(categories).map(category => ({
            category,
            amount: categories[category]
          })).sort((a, b) => b.amount - a.amount);
          
          setTripDetails({
            ...tripDetails,
            [tripId]: {
              expenses: expenses,
              categories: categoryData,
              totalSpent
            }
          });
        } catch (err) {
          console.error("Error fetching trip details:", err);
        }
      }
    }
  };

  // Function to handle adding a new trip
  const handleAddTrip = async (e) => {
    e.preventDefault();

    try {
      // Create a new trip
      const newTripData = {
        ...newTrip,
        budget: parseFloat(newTrip.budget) || 0,
      };

      const response = await enhancedTripService.addTrip(newTripData);
      
      // Format response for frontend
      const formattedTrip = {
        id: response._id || response.id || upcomingTrips.length + 1,
        name: response.tripName || newTripData.name,
        dates: `${new Date(response.startDate).toISOString().slice(0, 10)} - ${new Date(response.endDate).toISOString().slice(0, 10)}` || newTripData.dates,
        budget: response.totalBudget || newTripData.budget,
        remainingBudget: response.remainingBudget || newTripData.budget,
        status: "Upcoming",
      };

      // Add to local state
      const updatedTrips = [...upcomingTrips, formattedTrip];
      setUpcomingTrips(updatedTrips);

      // Clear form and close modal
      setNewTrip({
        name: "",
        dates: "",
        budget: "",
      });
      setShowAddTripModal(false);
    } catch (err) {
      console.error("Error adding trip:", err);
      setError("Failed to add trip. Please try again.");
    }
  };

  // Function to edit a trip
  const handleEditTripClick = (trip) => {
    const [startDate, endDate] = trip.dates.split(" - ");
    
    setEditingTrip({
      id: trip.id,
      name: trip.name,
      dates: `${startDate} - ${endDate}`,
      budget: trip.budget.toString(),
    });
    
    setShowEditTripModal(true);
  };

  // Function to update a trip
  const handleUpdateTrip = async (e) => {
    e.preventDefault();

    try {
      // Parse date range
      const [startDate, endDate] = editingTrip.dates.split(" - ");

      // Format data
      const formattedData = {
        tripName: editingTrip.name,
        totalBudget: parseFloat(editingTrip.budget),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      };

      // This would be an API call
      // await tripService.updateTrip(editingTrip.id, formattedData);

      // Update local state
      const updatedTrips = upcomingTrips.map((trip) =>
        trip.id === editingTrip.id
          ? {
              ...trip,
              name: editingTrip.name,
              dates: editingTrip.dates,
              budget: parseFloat(editingTrip.budget),
              remainingBudget: trip.remainingBudget + (parseFloat(editingTrip.budget) - trip.budget),
            }
          : trip
      );

      setUpcomingTrips(updatedTrips);

      // Update active trip info if needed
      if (activeTrip === upcomingTrips.find(t => t.id === editingTrip.id).name) {
        setActiveTrip(editingTrip.name);
        setActiveTripDates(editingTrip.dates);
      }

      // Close modal and reset editing state
      setShowEditTripModal(false);
      setEditingTrip(null);
    } catch (err) {
      console.error("Error updating trip:", err);
      setError("Failed to update trip. Please try again.");
    }
  };

  // Function to delete a trip
  const handleDeleteTrip = async (tripId) => {
    try {
      // Confirm deletion
      if (!window.confirm("Are you sure you want to delete this trip? All associated expenses will also be deleted.")) {
        return;
      }

      // Delete via API
      await enhancedTripService.deleteTrip(tripId);

      // Update local state
      const updatedTrips = upcomingTrips.filter((trip) => trip.id !== tripId);
      setUpcomingTrips(updatedTrips);

      // Reset expanded trip if it was deleted
      if (expandedTrip === tripId) {
        setExpandedTrip(null);
      }

      // If the active trip was deleted, set a new active trip
      const deletedTrip = upcomingTrips.find((trip) => trip.id === tripId);
      if (deletedTrip && deletedTrip.name === activeTrip) {
        if (updatedTrips.length > 0) {
          setActiveTrip(updatedTrips[0].name);
          setActiveTripDates(updatedTrips[0].dates);
        } else {
          setActiveTrip("");
          setActiveTripDates(null);
        }
      }
    } catch (err) {
      console.error("Error deleting trip:", err);
      setError("Failed to delete trip. Please try again.");
    }
  };

  // Render loading state
  if (loading && !upcomingTrips.length) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your trips...</p>
      </div>
    );
  }

  // Group trips by status
  const tripsByStatus = {
    Active: upcomingTrips.filter(trip => trip.status === "Active"),
    Upcoming: upcomingTrips.filter(trip => trip.status === "Upcoming"),
    Past: upcomingTrips.filter(trip => trip.status === "Past")
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        upcomingTrips={upcomingTrips}
        activeTrip={activeTrip}
        setActiveTrip={setActiveTrip}
        user={user}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeTrip={activeTrip}
          activeTripDates={activeTripDates}
          user={user}
          title="Trip Planner"
        />

        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Your Trips</h1>
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
              onClick={() => setShowAddTripModal(true)}
            >
              <Plus size={16} className="mr-1" />
              Add New Trip
            </button>
          </div>

          {/* Active Trips */}
          {tripsByStatus.Active.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Active Trips
              </h2>
              <div className="space-y-4">
                {tripsByStatus.Active.map((trip) => (
                  <div key={trip.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div 
                      className="p-4 border-l-4 border-green-500 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleTripDetails(trip.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-lg text-gray-800">{trip.name}</h3>
                          <div className="flex items-center text-gray-500 text-sm mt-1">
                            <Calendar size={14} className="mr-1" />
                            <span>{trip.dates}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-6">
                            <div className="text-sm text-gray-500">Budget</div>
                            <div className="font-medium">${trip.budget}</div>
                          </div>
                          <div className="mr-6">
                            <div className="text-sm text-gray-500">Remaining</div>
                            <div className="font-medium text-green-600">${trip.remainingBudget}</div>
                          </div>
                          <div className="flex">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTripClick(trip);
                              }}
                              className="text-gray-400 hover:text-indigo-600 mr-2"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTrip(trip.id);
                              }}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                          {expandedTrip === trip.id ? (
                            <ChevronUp size={20} className="ml-2 text-gray-500" />
                          ) : (
                            <ChevronDown size={20} className="ml-2 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded trip details */}
                    {expandedTrip === trip.id && (
                      <div className="border-t border-gray-100 p-4 bg-gray-50">
                        {tripDetails[trip.id] ? (
                          <div>
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-700 mb-2">Expense Summary</h4>
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="text-sm text-gray-500">Total Spent</div>
                                  <div className="text-lg font-medium">${tripDetails[trip.id].totalSpent.toFixed(2)}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Remaining Budget</div>
                                  <div className="text-lg font-medium text-green-600">
                                    ${(trip.budget - tripDetails[trip.id].totalSpent).toFixed(2)}
                                  </div>
                                </div>
                                <button
                                  className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                                  onClick={() => navigate(`/trip/${trip.id}/expenses`)}
                                >
                                  View Expenses
                                </button>
                              </div>
                            </div>
                            
                            {tripDetails[trip.id].categories.length > 0 && (
                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">Top Categories</h4>
                                <div className="grid grid-cols-3 gap-4">
                                  {tripDetails[trip.id].categories.slice(0, 3).map((cat, idx) => (
                                    <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                                      <div className="text-sm font-medium">{cat.category}</div>
                                      <div className="text-gray-700">${cat.amount.toFixed(2)}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-500">Loading trip details...</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Trips */}
          {tripsByStatus.Upcoming.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Upcoming Trips
              </h2>
              <div className="space-y-4">
                {tripsByStatus.Upcoming.map((trip) => (
                  <div key={trip.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div 
                      className="p-4 border-l-4 border-blue-500 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleTripDetails(trip.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-lg text-gray-800">{trip.name}</h3>
                          <div className="flex items-center text-gray-500 text-sm mt-1">
                            <Calendar size={14} className="mr-1" />
                            <span>{trip.dates}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-6">
                            <div className="text-sm text-gray-500">Budget</div>
                            <div className="font-medium">${trip.budget}</div>
                          </div>
                          <div className="flex">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTripClick(trip);
                              }}
                              className="text-gray-400 hover:text-indigo-600 mr-2"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTrip(trip.id);
                              }}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                          {expandedTrip === trip.id ? (
                            <ChevronUp size={20} className="ml-2 text-gray-500" />
                          ) : (
                            <ChevronDown size={20} className="ml-2 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded trip details */}
                    {expandedTrip === trip.id && (
                      <div className="border-t border-gray-100 p-4 bg-gray-50">
                        <div className="flex justify-center">
                          <button
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mr-4"
                            onClick={() => navigate(`/trip/${trip.id}/plan`)}
                          >
                            Plan Trip
                          </button>
                          <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            onClick={() => navigate(`/trip/${trip.id}/budget`)}
                          >
                            Set Budget
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Trips */}
          {tripsByStatus.Past.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Past Trips
              </h2>
              <div className="space-y-4">
                {tripsByStatus.Past.map((trip) => (
                  <div key={trip.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div 
                      className="p-4 border-l-4 border-gray-400 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleTripDetails(trip.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-lg text-gray-800">{trip.name}</h3>
                          <div className="flex items-center text-gray-500 text-sm mt-1">
                            <Calendar size={14} className="mr-1" />
                            <span>{trip.dates}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-6">
                            <div className="text-sm text-gray-500">Final Spend</div>
                            <div className="font-medium">${trip.budget - trip.remainingBudget}</div>
                          </div>
                          <div className="mr-6">
                            <div className="text-sm text-gray-500">Budget</div>
                            <div className="font-medium">${trip.budget}</div>
                          </div>
                          <div className="flex">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTrip(trip.id);
                              }}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                          {expandedTrip === trip.id ? (
                            <ChevronUp size={20} className="ml-2 text-gray-500" />
                          ) : (
                            <ChevronDown size={20} className="ml-2 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded trip details */}
                    {expandedTrip === trip.id && (
                      <div className="border-t border-gray-100 p-4 bg-gray-50">
                        {tripDetails[trip.id] ? (
                          <div>
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-700 mb-2">Trip Summary</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white p-3 rounded border border-gray-200">
                                  <div className="text-sm text-gray-500">Total Spent</div>
                                  <div className="text-lg font-medium">${tripDetails[trip.id].totalSpent.toFixed(2)}</div>
                                </div>
                                <div className="bg-white p-3 rounded border border-gray-200">
                                  <div className="text-sm text-gray-500">Budget</div>
                                  <div className="text-lg font-medium">${trip.budget.toFixed(2)}</div>
                                </div>
                                <div className="bg-white p-3 rounded border border-gray-200">
                                  <div className="text-sm text-gray-500">
                                    {trip.budget > tripDetails[trip.id].totalSpent ? 'Under Budget' : 'Over Budget'}
                                  </div>
                                  <div className={`text-lg font-medium ${
                                    trip.budget > tripDetails[trip.id].totalSpent ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    ${Math.abs(trip.budget - tripDetails[trip.id].totalSpent).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <button
                              className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                              onClick={() => navigate(`/trip/${trip.id}/summary`)}
                            >
                              View Full Trip Report
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-500">Loading trip details...</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {upcomingTrips.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No trips yet!</h3>
              <p className="text-gray-500 mb-4">
                Start planning your next adventure by adding a new trip.
              </p>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 inline-flex items-center"
                onClick={() => setShowAddTripModal(true)}
              >
                <Plus size={16} className="mr-1" />
                Add Your First Trip
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Add Trip Modal */}
      {showAddTripModal && (
        <TripModal
          isOpen={showAddTripModal}
          onClose={() => setShowAddTripModal(false)}
          title="Add New Trip"
          trip={newTrip}
          setTrip={setNewTrip}
          onSubmit={handleAddTrip}
          buttonText="Add Trip"
        />
      )}

      {/* Edit Trip Modal */}
      {showEditTripModal && (
        <TripModal
          isOpen={showEditTripModal}
          onClose={() => setShowEditTripModal(false)}
          title="Edit Trip"
          trip={editingTrip}
          setTrip={setEditingTrip}
          onSubmit={handleUpdateTrip}
          buttonText="Update Trip"
        />
      )}
    </div>
  );
};

export default TripPlanner;