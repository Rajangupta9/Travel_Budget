import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../controllers/authController";
import {
  IndianRupee,
  CreditCard,
  TrendingUp,
  Calendar,
  Plus,
} from "lucide-react";
import { tripService, expenseService } from "../controllers/authController";

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

// Create a modified tripService for proper model integration
export const enhancedTripService = {
  ...tripService,

  // Get all trips with proper formatting from Trip model
  getTrips: async () => {
    try {
      const response = await tripService.getTrips();
      const today = new Date();

      // Format trips to match the Trip schema
      return response.map((trip) => {
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);

        // Determine status based on dates
        let status;
        if (today >= startDate && today <= endDate) {
          status = "Active";
        } else if (today > endDate) {
          status = "Past";
        } else {
          status = "Upcoming";
        }

        return {
          id: trip._id || trip.id,
          name: trip.tripName || trip.name,
          dates: `${startDate.toISOString().slice(0, 10)} - ${endDate
            .toISOString()
            .slice(0, 10)}`,
          budget: trip.totalBudget,
          remainingBudget: trip.remainingBudget,
          dailyAverage: trip.dailyAverage,
          status: status,
          expenses: trip.expenses || [],
        };
      });
    } catch (error) {
      console.error("Error fetching trips:", error);
      throw error;
    }
  },

  // Add this to your enhancedTripService object
  deleteTrip: async (tripId) => {
    try {
      // Make API call to delete the trip
      const response = await tripService.deleteTrip(tripId);
      return response;
    } catch (error) {
      console.error("Error deleting trip:", error);
      throw error;
    }
  },

  // Get expenses for a specific trip
  getExpenses: async (tripId) => {
    try {
      // This would be an API call to fetch expenses from the Expense model
      const response = await expenseService.getExpenses({ tripId: tripId });

      const data = response;

      // Format expenses to match the Expense schema
      return data.map((expense) => ({
        id: expense._id,
        category: expense.category,
        description: expense.notes,
        amount: expense.amount,
        date: new Date(expense.date).toISOString().slice(0, 10),
        tripId: expense.trip,
      }));
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }
  },

  // Add a new expense
  addExpense: async (expenseData) => {
    try {
      // Format data to match Expense schema
      const formattedData = {
        trip: expenseData.tripId,
        category: expenseData.category,
        amount: parseFloat(expenseData.amount),
        date: new Date(expenseData.date),
        notes: expenseData.description,
      };

      // This would be an API call to create an expense in the Expense model
      const response = await expenseService.createExpense(formattedData);
      console.log(response);
      return await response.json();
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  },

  // Add this to your enhancedTripService object
  updateExpense: async (expenseId, expenseData) => {
    try {
      // Format data to match Expense schema
      const formattedData = {
        category: expenseData.category,
        amount: parseFloat(expenseData.amount),
        date: new Date(expenseData.date),
        notes: expenseData.description,
      };

      // API call to update expense
      const response = await expenseService.updateExpense(
        expenseId,
        formattedData
      );
      return response;
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  },

  // Delete an expense
  deleteExpense: async (expenseId) => {
    try {
      // This would be an API call to delete an expense from the Expense model
      await expenseService.deleteExpense(expenseId);
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  },

  // Add a new trip
  addTrip: async (tripData) => {
    try {
      // Parse date range
      const [startDate, endDate] = tripData.dates.split(" - ");

      // Format data to match Trip schema
      const formattedData = {
        tripName: tripData.name,
        totalBudget: parseFloat(tripData.budget),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      };

      // This would be an API call to create a trip in the Trip model
      const response = await tripService.createTrip(formattedData);
      console.log(response);

      return await response.json();
    } catch (error) {
      console.error("Error adding trip:", error);
      throw error;
    }
  },
};

const Dashboard = () => {
  // Router hooks
  const navigate = useNavigate();

  // State management
  const [editingExpense, setEditingExpense] = useState(null);
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTrip, setActiveTrip] = useState("");
  const [activeTripDates, setActiveTripDates] = useState(null);
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

          // Set tripId for new expenses
          setNewExpense((prev) => ({
            ...prev,
            tripId: selectedTrip.id,
          }));
        } else {
          // No trips yet
          setUpcomingTrips([]);
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

  useEffect(() => {
    if (activeTrip && upcomingTrips && upcomingTrips.length > 0) {
      const currentTrip = upcomingTrips.find(
        (trip) => trip.name === activeTrip
      );
      if (currentTrip) {
        // Update the active trip dates when selecting a different trip
        setActiveTripDates(currentTrip.dates);

        // Also update the tripId for new expenses
        setNewExpense((prev) => ({
          ...prev,
          tripId: currentTrip.id,
        }));
      }
    }
  }, [activeTrip, upcomingTrips]);

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

        // Fetch expenses for the current trip
      
          let expenses = await enhancedTripService.getExpenses(currentTrip.id);

        setRecentExpenses(expenses);

        // Update new expense form with current trip ID
        setNewExpense((prev) => ({
          ...prev,
          tripId: currentTrip.id,
        }));

        // Generate pie chart data from expenses
        generatePieChartData(expenses);

        // Generate bar chart data from expenses
        generateBarChartData(expenses, currentTrip);

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
    navigate("/login");
  };

  // Function to handle adding a new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      // Create a new expense using the enhanced service
      const newExpenseData = {
        ...newExpense,
        amount: parseFloat(newExpense.amount) || 0,
      };

      let response;
      try {
        // Try to create via API
        response = await enhancedTripService.addExpense(newExpenseData);

        // Format to match frontend structure
        response = {
          id: response._id || response.id || recentExpenses.length + 1,
          category: response.category || newExpenseData.category,
          description: response.notes || newExpenseData.description,
          amount: response.amount || newExpenseData.amount,
          date:
            new Date(response.date).toISOString().slice(0, 10) ||
            newExpenseData.date,
          tripId: response.trip || newExpenseData.tripId,
        };
      } catch (err) {
        // Fall back to local state if API fails
        response = {
          id: recentExpenses.length + 1,
          ...newExpenseData,
        };
      }

      // Add to local state
      const updatedExpenses = [...recentExpenses, response];
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

      // Update trip data in state
      // This would happen automatically via the Expense model post-save middleware
      // but we'll also update the UI for immediate feedback
      const currentTrip = upcomingTrips.find(
        (trip) => trip.name === activeTrip
      );
      if (currentTrip) {
        // Update the remaining budget
        const updatedTrips = upcomingTrips.map((trip) => {
          if (trip.id === currentTrip.id) {
            const newRemainingBudget =
              trip.remainingBudget - newExpenseData.amount;
            const spent = trip.budget - newRemainingBudget;

            // Calculate days elapsed for daily average
            const dateRange = trip.dates.split(" - ");
            const startDate = new Date(dateRange[0]);
            const endDate = new Date(dateRange[1]);
            const totalDays =
              Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

            return {
              ...trip,
              remainingBudget: newRemainingBudget,
              dailyAverage: spent / totalDays,
            };
          }
          return trip;
        });

        setUpcomingTrips(updatedTrips);
      }

      // Update charts
      const trip = upcomingTrips.find((trip) => trip.name === activeTrip);
      generatePieChartData(updatedExpenses);
      generateBarChartData(updatedExpenses, trip);
    } catch (err) {
      console.error("Error adding expense:", err);
      setError("Failed to add expense. Please try again.");
    }
    finally{}
  };

  // Function to handle adding a new trip
  const handleAddTrip = async (e) => {
    e.preventDefault();

    try {
      // Create a new trip using the enhanced service
      const newTripData = {
        ...newTrip,
        budget: parseFloat(newTrip.budget) || 0,
      };

      let response;
      try {
        // Try to create via API
        response = await enhancedTripService.addTrip(newTripData);

        // Format to match frontend structure
        response = {
          id: response._id || response.id || upcomingTrips.length + 1,
          name: response.tripName || newTripData.name,
          dates:
            `${new Date(response.startDate)
              .toISOString()
              .slice(0, 10)} - ${new Date(response.endDate)
              .toISOString()
              .slice(0, 10)}` || newTripData.dates,
          budget: response.totalBudget || newTripData.budget,
          remainingBudget: response.remainingBudget || newTripData.budget,
          status: response.name || "upcoming",
        };
      } catch (err) {
        // Fall back to local state if API fails
        response = {
          id: upcomingTrips.length + 1,
          ...newTripData,
          remainingBudget: newTripData.budget,
          status: "upcoming",
        };
      }

      // Add to local state
      const updatedTrips = [...upcomingTrips, response];
      setUpcomingTrips(updatedTrips);
      setActiveTrip(response.name);

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

  // Function to handle deleting a trip
  const handleDeleteTrip = async (tripId) => {
    try {
      // Confirm deletion
      if (
        !window.confirm(
          "Are you sure you want to delete this trip? All associated expenses will also be deleted."
        )
      ) {
        return;
      }

      // Delete via API
      try {
        await enhancedTripService.deleteTrip(tripId);
      } catch (err) {
        console.warn("API delete failed, updating UI only:", err);
      }

      // Update local state
      const updatedTrips = upcomingTrips.filter((trip) => trip.id !== tripId);
      setUpcomingTrips(updatedTrips);

      // If the active trip was deleted, set a new active trip
      const deletedTrip = upcomingTrips.find((trip) => trip.id === tripId);
      if (deletedTrip && deletedTrip.name === activeTrip) {
        if (updatedTrips.length > 0) {
          setActiveTrip(updatedTrips[0].name);
        } else {
          setActiveTrip("");
        }
      }
    } catch (err) {
      console.error("Error deleting trip:", err);
      setError("Failed to delete trip. Please try again.");
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense({
      id: expense.id,
      category: expense.category,
      description: expense.description,
      amount: expense.amount.toString(),
      date: expense.date,
      tripId: expense.tripId,
    });
    setShowEditExpenseModal(true);
  };

  // Add this function to your Dashboard component
  const handleUpdateExpense = async (e) => {
    e.preventDefault();

    try {
      const originalExpense = recentExpenses.find(
        (expense) => expense.id === editingExpense.id
      );
      const oldAmount = parseFloat(originalExpense.amount);
      const newAmount = parseFloat(editingExpense.amount);
      const amountDifference = newAmount - oldAmount;

      // Update via API
      try {
        await enhancedTripService.updateExpense(
          editingExpense.id,
          editingExpense
        );
      } catch (err) {
        console.warn("API update failed, updating UI only:", err);
      }

      // Update local state
      const updatedExpenses = recentExpenses.map((expense) =>
        expense.id === editingExpense.id
          ? {
              ...editingExpense,
              amount: parseFloat(editingExpense.amount),
            }
          : expense
      );

      setRecentExpenses(updatedExpenses);

      // Update trip budget
      const currentTrip = upcomingTrips.find(
        (trip) => trip.name === activeTrip
      );
      if (currentTrip) {
        const updatedTrips = upcomingTrips.map((trip) => {
          if (trip.id === currentTrip.id) {
            const newRemainingBudget = trip.remainingBudget - amountDifference;
            return { ...trip, remainingBudget: newRemainingBudget };
          }
          return trip;
        });

        setUpcomingTrips(updatedTrips);
      }

      // Update charts
      generatePieChartData(updatedExpenses);
      generateBarChartData(updatedExpenses, currentTrip);

      // Close modal and reset editing state
      setShowEditExpenseModal(false);
      setEditingExpense(null);
    } catch (err) {
      console.error("Error updating expense:", err);
      setError("Failed to update expense. Please try again.");
    }
  };

  // Add this function to your Dashboard component
  const handleViewAllExpenses = async (tripId) => {
    try {
      setLoading(true);

      // Find the trip with the given ID
      const trip = upcomingTrips.find((trip) => trip.id === tripId);
      if (trip) {
        setActiveTrip(trip.name);

        // Fetch expenses for this trip
        const expenses = await enhancedTripService.getExpenses(tripId);
        setRecentExpenses(expenses);

        // Update charts
        generatePieChartData(expenses);
        generateBarChartData(expenses, trip);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching all expenses:", err);
      setError("Failed to load all expenses. Please try again.");
      setLoading(false);
    }
  };

  // Function to handle deleting an expense
  const handleDeleteExpense = async (expenseToDelete) => {
    const {id} = expenseToDelete;
    try {
     
      const index = recentExpenses.findIndex(exp => exp.id === id);
    
    if (index === -1) {
      console.error("Expense not found in array");
      return;
    }
    console.log(index);

      const expenseToDelete = recentExpenses[index];
       
      try {
        // Try to delete via API
        await enhancedTripService.deleteExpense(expenseToDelete.id);
      } catch (err) {
        // Proceed with UI update even if API fails
        console.warn("API delete failed, updating UI only:", err);
      }

      // Remove from local state
      const updatedExpenses = [...recentExpenses];
      updatedExpenses.splice(index, 1);
      setRecentExpenses(updatedExpenses);

      // Update trip data in state
      // This would happen automatically via the Expense model middleware
      // but we'll also update the UI for immediate feedback
      const currentTrip = upcomingTrips.find(
        (trip) => trip.name === activeTrip
      );
      if (currentTrip) {
        // Update the remaining budget
        const updatedTrips = upcomingTrips.map((trip) => {
          if (trip.id === currentTrip.id) {
            const newRemainingBudget =
              trip.remainingBudget + parseFloat(expenseToDelete.amount);
            const spent = trip.budget - newRemainingBudget;

            // Calculate days elapsed for daily average
            const dateRange = trip.dates.split(" - ");
            const startDate = new Date(dateRange[0]);
            const endDate = new Date(dateRange[1]);
            const totalDays =
              Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

            return {
              ...trip,
              remainingBudget: newRemainingBudget,
              dailyAverage: spent / totalDays,
            };
          }
          return trip;
        });

        setUpcomingTrips(updatedTrips);
      }

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
        handleDeleteTrip={handleDeleteTrip}
        handleViewAllExpenses={handleViewAllExpenses}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeTrip={activeTrip}
          activeTripDates={activeTripDates}
          setShowAddExpenseModal={setShowAddExpenseModal}
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
                  icon={<IndianRupee className="text-green-500" />}
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
                handleEditExpense={handleEditExpense}
                emptyState={
                  <div className="text-center py-8 text-gray-500">
                    No expenses recorded for this trip yet.
                  </div>
                }
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
        showEditExpenseModal={showEditExpenseModal}
        setShowEditExpenseModal={setShowEditExpenseModal}
        editingExpense={editingExpense}
        setEditingExpense={setEditingExpense}
        handleUpdateExpense={handleUpdateExpense}
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
