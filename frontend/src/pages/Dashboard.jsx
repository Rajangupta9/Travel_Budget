import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../controllers/authController";
import { DollarSign, CreditCard, TrendingUp, Calendar, Plus } from "lucide-react";
import {tripService} from "../controllers/authController";

// Import components
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import BudgetCard from "../components/dashboard/BudgetCard";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import DailySpendingChart from "../components/dashboard/DailySpendingChart";
import ExpenseTable from "../components/dashboard/ExpenseTable";
import ExpenseModal from "../components/modals/ExpenseModel";
import TripModal from "../components/modals/TripModel";
import { getCategoryIcon } from "../utils/categoryIcons";

const Dashboard = () => {
  // Router hooks
  const navigate = useNavigate();

  // State management
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTrip, setActiveTrip] = useState("");
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: "Food",
    description: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    tripId: "",
  });
  const [newTrip, setNewTrip] = useState({
    name: "",
    dates: "",
    budget: "",
  });
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [currentTripData, setCurrentTripData] = useState({
    totalBudget: 0,
    spent: 0,
    dailyAverage: 0,
    dailyTarget: 0,
    remainingBudget: 0,
    daysRemaining: 0,
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile and trips data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Commented out API call - will be implemented later
        const userRes = await getProfile();
        // console.log(userRes);
        // setUser(userRes.name);
        
        // Mock user data instead of API call
        setUser({ name: userRes.name , planType: userRes.premiumPlan});
        
        // Mock trip data instead of API call
        const mockTrip = await tripService.getTrips();
        console.log(mockTrip);
        setUpcomingTrips([mockTrip]);
        setActiveTrip(mockTrip.name);

        // Set tripId for new expenses
        setNewExpense((prev) => ({
          ...prev,
          tripId: mockTrip.id,
        }));

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

  // Fetch expenses when active trip changes
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!activeTrip) return;

      try {
        setLoading(true);

        // Find the trip ID based on the active trip name
        const currentTrip = upcomingTrips.find(
          (trip) => trip.name === activeTrip
        );
        
        if (!currentTrip) {
          setLoading(false);
          return;
        }

        // Mock expense data instead of API call
        const mockExpenses = [
          {
            id: 1,
            category: "Food",
            description: "Sushi",
            amount: 50,
            date: "2022-10-02",
            tripId: currentTrip.id,
          },
          {
            id: 2,
            category: "Transport",
            description: "Train ticket",
            amount: 30,
            date: "2022-10-03",
            tripId: currentTrip.id,
          },
          {
            id: 3,
            category: "Accommodation",
            description: "Hotel in Tokyo",
            amount: 120,
            date: "2022-10-01",
            tripId: currentTrip.id,
          },
          {
            id: 4,
            category: "Activities",
            description: "Museum tickets",
            amount: 25,
            date: "2022-10-04",
            tripId: currentTrip.id,
          }
        ];

        setRecentExpenses(mockExpenses);

        // Update new expense form with current trip ID
        setNewExpense((prev) => ({
          ...prev,
          tripId: currentTrip.id,
        }));

        // Generate pie chart data from expenses
        generatePieChartData(mockExpenses);

        // Generate bar chart data from expenses
        generateBarChartData(mockExpenses, currentTrip);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError(
          "Failed to load expenses for this trip. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [activeTrip, upcomingTrips]);

  // Update trip data when active trip or expenses change
  useEffect(() => {
    if (!activeTrip) return;

    const trip = upcomingTrips.find((trip) => trip.name === activeTrip);

    if (trip) {
      // Calculate days remaining
      const dateRange = trip.dates.split(" - ");
      const endDate = new Date(dateRange[1]);
      const today = new Date();
      const daysRemaining = Math.max(
        0,
        Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
      );

      // Calculate total spent from recentExpenses
      const spent = recentExpenses.reduce(
        (total, expense) => total + parseFloat(expense.amount),
        0
      );

      // Calculate daily average (spent divided by days elapsed)
      const startDate = new Date(dateRange[0]);
      const totalDays = Math.ceil(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
      ) + 1;
      const daysElapsed = Math.max(1, totalDays - daysRemaining);
      const dailyAverage = Math.round(spent / daysElapsed);

      setCurrentTripData({
        totalBudget: trip.budget,
        spent: spent,
        dailyAverage: dailyAverage,
        dailyTarget: Math.round(trip.budget / totalDays),
        remainingBudget: trip.budget - spent,
        daysRemaining: daysRemaining,
      });
    }
  }, [activeTrip, upcomingTrips, recentExpenses]);

  // Function to generate pie chart data from expenses
  const generatePieChartData = (expenses) => {
    const categories = {
      Food: { value: 0, color: "#ec4899" },
      Transport: { value: 0, color: "#8b5cf6" },
      Accommodation: { value: 0, color: "#4f46e5" },
      Activities: { value: 0, color: "#f97316" },
      Shopping: { value: 0, color: "#14b8a6" },
      Other: { value: 0, color: "#6b7280" },
    };

    // Sum up expenses by category
    expenses.forEach((expense) => {
      const category = expense.category;
      if (categories[category]) {
        categories[category].value += parseFloat(expense.amount);
      } else {
        categories.Other.value += parseFloat(expense.amount);
      }
    });

    // Convert to array format for the chart
    const chartData = Object.keys(categories)
      .filter((cat) => categories[cat].value > 0)
      .map((cat) => ({
        name: cat,
        value: categories[cat].value,
        color: categories[cat].color,
      }));

    setPieData(chartData);
  };

  // Function to generate bar chart data from expenses
  const generateBarChartData = (expenses, trip) => {
    if (!trip) return;

    // Parse trip dates
    const dateRange = trip.dates.split(" - ");
    const startDate = new Date(dateRange[0]);
    const endDate = new Date(dateRange[1]);

    // Calculate daily budget
    const totalDays =
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const dailyBudget = trip.budget / totalDays;

    // Create a map of day -> expenses
    const dailyExpenses = {};

    // Initialize all days in the range
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().slice(0, 10);
      dailyExpenses[dateKey] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Add up expenses by day
    expenses.forEach((expense) => {
      const expenseDate = expense.date.slice(0, 10);
      if (dailyExpenses[expenseDate] !== undefined) {
        dailyExpenses[expenseDate] += parseFloat(expense.amount);
      }
    });

    // Convert to array format for the chart
    const chartData = Object.keys(dailyExpenses).map((date) => {
      const displayDate = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return {
        day: displayDate,
        spent: dailyExpenses[date],
        budget: dailyBudget,
      };
    });

    setBarData(chartData);
  };

  // Function to handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Function to handle logout
  const handleLogout = () => {
    // Commented out token removal - will be implemented with middleware
    // localStorage.removeItem("accessToken");
    navigate("/login");
  };

  // Function to handle adding a new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      // Commented out API call - will be implemented later
      // const token = localStorage.getItem("accessToken");
      // const expenseData = {
      //   ...newExpense,
      //   amount: parseFloat(newExpense.amount),
      // };
      // await axios.post("/api/expenses", expenseData, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      // Create a new mock expense
      const newExpenseData = {
        id: recentExpenses.length + 1,
        ...newExpense,
        amount: parseFloat(newExpense.amount) || 0,
      };

      // Add to local state instead of API call
      const updatedExpenses = [...recentExpenses, newExpenseData];
      setRecentExpenses(updatedExpenses);

      // Clear form and close modal
      setNewExpense({
        category: "Food",
        description: "",
        amount: "",
        date: new Date().toISOString().slice(0, 10),
        tripId: newExpenseData.tripId,
      });
      setShowAddExpenseModal(false);

      // Update charts
      const trip = upcomingTrips.find((trip) => trip.name === activeTrip);
      generatePieChartData(updatedExpenses);
      generateBarChartData(updatedExpenses, trip);
    } catch (err) {
      console.error("Error adding expense:", err);
      setError("Failed to add expense. Please try again.");
    }
  };

  // Function to handle adding a new trip
  const handleAddTrip = async (e) => {
    e.preventDefault();

    try {
      // Commented out API call - will be implemented later
      // const token = localStorage.getItem("accessToken");
      // const response = await axios.post(
      //   "/api/trips",
      //   {
      //     ...newTrip,
      //     budget: parseFloat(newTrip.budget),
      //   },
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   }
      // );

      // Create a new mock trip
      const newTripData = {
        id: upcomingTrips.length + 1,
        ...newTrip,
        budget: parseFloat(newTrip.budget) || 0,
      };

      // Add to local state instead of API call
      const updatedTrips = [...upcomingTrips, newTripData];
      setUpcomingTrips(updatedTrips);
      setActiveTrip(newTripData.name);

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

  // Function to handle deleting an expense
  const handleDeleteExpense = async (index) => {
    try {
      // Commented out API call - will be implemented later
      // const token = localStorage.getItem("accessToken");
      // const expenseId = recentExpenses[index].id;
      // await axios.delete(`/api/expenses/${expenseId}`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      // Remove from local state
      const updatedExpenses = [...recentExpenses];
      updatedExpenses.splice(index, 1);
      setRecentExpenses(updatedExpenses);

      // Update charts
      const trip = upcomingTrips.find((trip) => trip.name === activeTrip);
      generatePieChartData(updatedExpenses);
      generateBarChartData(updatedExpenses, trip);
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError("Failed to delete expense. Please try again.");
    }
  };

  // Render loading state
  if (loading && !upcomingTrips.length) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your travel budget...</p>
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
        setShowAddTripModal={setShowAddTripModal}
        user={user}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeTrip={activeTrip}
          setShowAddExpenseModal={setShowAddExpenseModal}
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

          {activeTrip ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <BudgetCard
                  title="Total Budget"
                  value={`$${currentTripData.totalBudget.toLocaleString()}`}
                  subtitle={{
                    text: `$${currentTripData.remainingBudget.toLocaleString()} remaining`,
                    className: "text-sm text-gray-500",
                  }}
                  icon={<DollarSign className="text-green-500" />}
                />
                <BudgetCard
                  title="Spent So Far"
                  value={`$${currentTripData.spent.toLocaleString()}`}
                  subtitle={{
                    text: `${Math.round(
                      (currentTripData.spent / currentTripData.totalBudget) *
                        100
                    )}% of budget`,
                    className: "text-sm text-gray-500",
                  }}
                  icon={<CreditCard className="text-blue-500" />}
                />
                <BudgetCard
                  title="Daily Average"
                  value={`$${currentTripData.dailyAverage.toLocaleString()}`}
                  subtitle={{
                    text: `Target: $${currentTripData.dailyTarget.toLocaleString()}`,
                    className:
                      currentTripData.dailyAverage > currentTripData.dailyTarget
                        ? "text-sm text-red-500"
                        : "text-sm text-green-500",
                  }}
                  icon={<TrendingUp className="text-purple-500" />}
                />
                <BudgetCard
                  title="Days Remaining"
                  value={currentTripData.daysRemaining}
                  subtitle={{
                    text: `$${Math.round(
                      currentTripData.remainingBudget /
                        Math.max(1, currentTripData.daysRemaining)
                    ).toLocaleString()} per day remaining`,
                    className: "text-sm text-gray-500",
                  }}
                  icon={<Calendar className="text-orange-500" />}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <ExpenseChart pieData={pieData} />
                <DailySpendingChart barData={barData} />
              </div>

              <ExpenseTable
                recentExpenses={recentExpenses}
                getCategoryIcon={getCategoryIcon}
                handleDeleteExpense={handleDeleteExpense}
              />
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                Welcome to TravelBudget
              </h2>
              <p className="text-gray-600 mb-6">
                Start by adding your first trip to track your travel expenses.
              </p>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                onClick={() => setShowAddTripModal(true)}
              >
                <Plus size={16} className="inline mr-1" />
                Add Your First Trip
              </button>
            </div>
          )}
        </main>
      </div>

      <ExpenseModal
        showAddExpenseModal={showAddExpenseModal}
        setShowAddExpenseModal={setShowAddExpenseModal}
        newExpense={newExpense}
        setNewExpense={setNewExpense}
        handleAddExpense={handleAddExpense}
      />

      <TripModal
        showAddTripModal={showAddTripModal}
        setShowAddTripModal={setShowAddTripModal}
        newTrip={newTrip}
        setNewTrip={setNewTrip}
        handleAddTrip={handleAddTrip}
      />
    </div>
  );
};

export default Dashboard;