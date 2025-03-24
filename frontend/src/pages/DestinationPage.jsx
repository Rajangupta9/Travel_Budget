import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Info, Globe, Clock, Thermometer, CreditCard, Calendar, ChevronLeft } from "lucide-react";
import { getProfile } from "../controllers/authController";
import { enhancedTripService } from "./Dashboard";

// Import components
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const DestinationPage = () => {
  // Router hooks
  const navigate = useNavigate();

  // State management
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTrip, setActiveTrip] = useState("");
  const [activeTripDates, setActiveTripDates] = useState(null);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [currentDestination, setCurrentDestination] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTripData, setCurrentTripData] = useState({
    totalBudget: 0,
    spent: 0,
    dailyAverage: 0,
    dailyTarget: 0,
    remainingBudget: 0,
    daysRemaining: 0,
  });

  // Mock destination data - in a real app, this would come from an API
  const destinationData = {
    "Tokyo": {
      country: "Japan",
      currency: "JPY",
      exchangeRate: 0.0067,
      timezone: "UTC+9",
      bestTimeToVisit: "March-May, Sep-Nov",
      avgTemperature: "16°C (61°F)",
      budgetTips: [
        "Use the efficient subway system instead of taxis",
        "Try affordable conveyor belt sushi restaurants",
        "Stay in a capsule hotel for a unique and budget-friendly experience",
        "Visit free attractions like the Imperial Palace gardens"
      ],
      image: "/api/placeholder/800/400"
    },
    "Paris": {
      country: "France",
      currency: "EUR",
      exchangeRate: 1.09,
      timezone: "UTC+1",
      bestTimeToVisit: "Apr-Jun, Sep-Oct",
      avgTemperature: "12°C (54°F)",
      budgetTips: [
        "Buy a Paris Museum Pass for multiple attractions",
        "Use Vélib' bike sharing system to get around",
        "Picnic in parks instead of dining at restaurants for every meal",
        "Look for 'prix fixe' lunch menus for better value"
      ],
      image: "/api/placeholder/800/400"
    },
    "Bangkok": {
      country: "Thailand",
      currency: "THB",
      exchangeRate: 0.028,
      timezone: "UTC+7",
      bestTimeToVisit: "Nov-Feb",
      avgTemperature: "28°C (82°F)",
      budgetTips: [
        "Eat at street food stalls for authentic and cheap meals",
        "Use the BTS Skytrain or MRT subway to avoid traffic",
        "Visit temples on free admission days",
        "Shop at markets like Chatuchak instead of malls"
      ],
      image: "/api/placeholder/800/400"
    },
    "New York": {
      country: "USA",
      currency: "USD",
      exchangeRate: 1.0,
      timezone: "UTC-5",
      bestTimeToVisit: "Apr-Jun, Sep-Nov",
      avgTemperature: "13°C (55°F)",
      budgetTips: [
        "Buy a MetroCard for unlimited subway rides",
        "Visit museums during suggested donation times",
        "Take the Staten Island Ferry for free views of the Statue of Liberty",
        "Look for happy hour specials at restaurants and bars"
      ],
      image: "/api/placeholder/800/400"
    },
    "Rome": {
      country: "Italy",
      currency: "EUR",
      exchangeRate: 1.09,
      timezone: "UTC+1",
      bestTimeToVisit: "Apr-May, Sep-Oct",
      avgTemperature: "15°C (59°F)",
      budgetTips: [
        "Visit main attractions early to avoid crowds and ticket lines",
        "Drink from public water fountains 'nasoni' to save on bottled water",
        "Have lunch at 'tavola calda' (cafeteria-style restaurants)",
        "Look for combo tickets for multiple sites like Colosseum + Forum"
      ],
      image: "/api/placeholder/800/400"
    }
  };

  // Fetch user profile and trips data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user profile
        const userRes = await getProfile();
        setUser({ name: userRes.name, planType: userRes.premiumPlan });

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

          // Set the active trip dates for the header
          setActiveTripDates(selectedTrip.dates);

          // Create destinations from trip names
          const extractedDestinations = sortedTrips.map(trip => {
            // Extract destination from trip name (assuming format like "Trip to Paris" or just "Paris")
            const nameParts = trip.name.split(" ");
            const destination = nameParts[nameParts.length - 1];
            
            // Match with our destination data or create generic entry
            const destData = destinationData[destination] || {
              country: "Unknown",
              currency: "Unknown",
              exchangeRate: 1.0,
              timezone: "Unknown",
              bestTimeToVisit: "Anytime",
              avgTemperature: "Unknown",
              budgetTips: ["Research local options for the best value"],
              image: "/api/placeholder/800/400"
            };
            
            return {
              id: trip.id,
              name: destination,
              tripName: trip.name,
              ...destData,
              budget: trip.budget,
              remainingBudget: trip.remainingBudget,
              dates: trip.dates
            };
          });
          
          setDestinations(extractedDestinations);
          setCurrentDestination(extractedDestinations[0]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "Failed to load your profile and trips. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Update trip data when active trip changes
  useEffect(() => {
    if (!activeTrip) return;

    const trip = upcomingTrips.find((trip) => trip.name === activeTrip);

    if (trip) {
      // Parse date range
      const dateRange = trip.dates.split(" - ");
      const startDate = new Date(dateRange[0]);
      const endDate = new Date(dateRange[1]);
      const today = new Date();

      // Calculate days remaining (if trip hasn't ended)
      const daysRemaining = Math.max(
        0,
        Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
      );

      // Calculate total days in trip
      const totalDays =
        Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      // Calculate days elapsed
      const daysElapsed = Math.max(1, totalDays - daysRemaining);

      // Calculate total spent
      const spent = trip.budget - trip.remainingBudget;

      // Use daily average from model if available, otherwise calculate
      const dailyAverage = trip.dailyAverage || Math.round(spent / daysElapsed);

      setCurrentTripData({
        totalBudget: trip.budget,
        spent: spent,
        dailyAverage: dailyAverage,
        dailyTarget: Math.round(trip.budget / totalDays),
        remainingBudget: trip.remainingBudget,
        daysRemaining: daysRemaining,
      });

      // Update current destination based on active trip
      const matchingDestination = destinations.find(dest => dest.tripName === activeTrip);
      if (matchingDestination) {
        setCurrentDestination(matchingDestination);
      }
    }
  }, [activeTrip, upcomingTrips, destinations]);

  // Function to handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Function to handle logout
  const handleLogout = () => {
    navigate("/login");
  };

  // Function to go back to dashboard
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  // Function to select a destination
  const selectDestination = (destination) => {
    setCurrentDestination(destination);
    
    // Find and set the related trip as active
    const relatedTrip = upcomingTrips.find(trip => trip.id === destination.id);
    if (relatedTrip) {
      setActiveTrip(relatedTrip.name);
      setActiveTripDates(relatedTrip.dates);
    }
  };

  // Render loading state
  if (loading && !upcomingTrips.length) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your destinations...</p>
      </div>
    );
  }

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
          upcomingTrips={upcomingTrips}
          currentTripData={currentTripData}
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

          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <ChevronLeft size={16} />
              <span className="ml-1">Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800 ml-4">
              Destinations
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Destination list sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-indigo-600 text-white">
                  <h2 className="font-semibold">Your Destinations</h2>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {destinations.map((destination) => (
                    <div
                      key={destination.id}
                      className={`p-4 border-b cursor-pointer hover:bg-indigo-50 ${
                        currentDestination && currentDestination.id === destination.id
                          ? "bg-indigo-100"
                          : ""
                      }`}
                      onClick={() => selectDestination(destination)}
                    >
                      <div className="flex items-center">
                        <MapPin size={16} className="text-indigo-500 mr-2" />
                        <div>
                          <h3 className="font-medium">{destination.name}</h3>
                          <p className="text-sm text-gray-500">
                            {destination.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Destination details */}
            <div className="md:col-span-3">
              {currentDestination ? (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={currentDestination.image}
                      alt={currentDestination.name}
                      className="w-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black to-transparent">
                      <h2 className="text-2xl font-bold text-white">
                        {currentDestination.name}
                      </h2>
                      <p className="text-white opacity-90">
                        {currentDestination.country}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="flex items-start">
                        <Globe className="text-indigo-500 mr-3 mt-1" size={20} />
                        <div>
                          <h3 className="font-medium text-gray-700">Currency</h3>
                          <p>{currentDestination.currency}</p>
                          <p className="text-sm text-gray-500">
                            Exchange rate: 1 USD = {Math.round(1/currentDestination.exchangeRate * 100) / 100} {currentDestination.currency}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Clock className="text-indigo-500 mr-3 mt-1" size={20} />
                        <div>
                          <h3 className="font-medium text-gray-700">Time Zone</h3>
                          <p>{currentDestination.timezone}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Calendar className="text-indigo-500 mr-3 mt-1" size={20} />
                        <div>
                          <h3 className="font-medium text-gray-700">Best Time to Visit</h3>
                          <p>{currentDestination.bestTimeToVisit}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Thermometer className="text-indigo-500 mr-3 mt-1" size={20} />
                        <div>
                          <h3 className="font-medium text-gray-700">Average Temperature</h3>
                          <p>{currentDestination.avgTemperature}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-start mb-3">
                        <CreditCard className="text-indigo-500 mr-3 mt-1" size={20} />
                        <h3 className="font-medium text-gray-700">Budget Overview</h3>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Total Budget</p>
                            <p className="font-semibold text-lg">${currentDestination.budget.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Remaining</p>
                            <p className="font-semibold text-lg">${currentDestination.remainingBudget.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Spent</p>
                            <p className="font-semibold text-lg">${(currentDestination.budget - currentDestination.remainingBudget).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-start mb-3">
                        <Info className="text-indigo-500 mr-3 mt-1" size={20} />
                        <h3 className="font-medium text-gray-700">Budget-Saving Tips</h3>
                      </div>
                      <ul className="list-disc list-inside space-y-2 pl-6">
                        {currentDestination.budgetTips.map((tip, index) => (
                          <li key={index} className="text-gray-700">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h2 className="text-xl font-bold text-gray-700 mb-4">
                    No Destination Selected
                  </h2>
                  <p className="text-gray-600">
                    Please select a destination from the list to view details.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DestinationPage;