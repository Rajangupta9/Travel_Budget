import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { enhancedTripService } from "./Dashboard";
import { Filter, Plus, Download } from "lucide-react";

// Import components
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ExpenseTable from "../components/dashboard/ExpenseTable";
import ExpenseModal from "../components/modals/ExpenseModel";
import { getProfile } from "../controllers/authController";
import { getCategoryIcon } from "../utils/categoryIcons";

const Expenses = () => {
  // Router hooks
  const navigate = useNavigate();
  const { tripId } = useParams();

  // State management
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTrip, setActiveTrip] = useState("");
  const [activeTripDates, setActiveTripDates] = useState(null);
  const [activeTripId, setActiveTripId] = useState(tripId || "");
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpense, setNewExpense] = useState({
    category: "Food",
    description: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    tripId: "",
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "All",
    dateFrom: "",
    dateTo: "",
    amountMin: "",
    amountMax: "",
  });
  const [showFilters, setShowFilters] = useState(false);

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

          // Set active trip based on URL param or default to first active trip
          let selectedTrip;
          
          if (tripId) {
            selectedTrip = sortedTrips.find((trip) => trip.id === tripId);
          }
          
          if (!selectedTrip) {
            // Use first active trip or first trip
            selectedTrip = sortedTrips.find((trip) => trip.status === "Active") || sortedTrips[0];
          }

          setActiveTripId(selectedTrip.id);
          setActiveTrip(selectedTrip.name);
          setActiveTripDates(selectedTrip.dates);

          // Set tripId for new expenses
          setNewExpense((prev) => ({
            ...prev,
            tripId: selectedTrip.id,
          }));

          // Fetch expenses for this trip
          const tripExpenses = await enhancedTripService.getExpenses(selectedTrip.id);
          setExpenses(tripExpenses);
          setFilteredExpenses(tripExpenses);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load your expenses. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, tripId]);

  // Function to handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Function to handle logout
  const handleLogout = () => {
    navigate("/login");
  };

  // Function to handle changing active trip
  const handleChangeTrip = async (tripName) => {
    const trip = upcomingTrips.find((trip) => trip.name === tripName);
    
    if (trip) {
      setActiveTrip(tripName);
      setActiveTripId(trip.id);
      setActiveTripDates(trip.dates);
      
      try {
        setLoading(true);
        
        // Fetch expenses for this trip
        const tripExpenses = await enhancedTripService.getExpenses(trip.id);
        setExpenses(tripExpenses);
        setFilteredExpenses(tripExpenses);
        
        // Update new expense form
        setNewExpense((prev) => ({
          ...prev,
          tripId: trip.id,
        }));
        
        // Reset filters
        setFilters({
          category: "All",
          dateFrom: "",
          dateTo: "",
          amountMin: "",
          amountMax: "",
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError("Failed to load expenses for this trip.");
        setLoading(false);
      }
    }
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

      const response = await enhancedTripService.addExpense(newExpenseData);
      
      // Format response for frontend
      const formattedExpense = {
        id: response._id || response.id || expenses.length + 1,
        category: response.category || newExpenseData.category,
        description: response.notes || newExpenseData.description,
        amount: response.amount || newExpenseData.amount,
        date: new Date(response.date).toISOString().slice(0, 10) || newExpenseData.date,
        tripId: response.trip || newExpenseData.tripId,
      };

      // Add to local state
      const updatedExpenses = [...expenses, formattedExpense];
      setExpenses(updatedExpenses);
      
      // Apply current filters to updated expenses
      applyFilters(updatedExpenses);

      // Clear form and close modal
      setNewExpense({
        category: "Food",
        description: "",
        amount: "",
        date: new Date().toISOString().slice(0, 10),
        tripId: newExpenseData.tripId,
      });
      
      setShowAddExpenseModal(false);
    } catch (err) {
      console.error("Error adding expense:", err);
      setError("Failed to add expense. Please try again.");
    }
  };

  // Function to handle editing an expense
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

  // Function to handle updating an expense
  const handleUpdateExpense = async (e) => {
    e.preventDefault();

    try {
      // Update via API
      await enhancedTripService.updateExpense(editingExpense.id, editingExpense);

      // Update local state
      const updatedExpenses = expenses.map((expense) =>
        expense.id === editingExpense.id
          ? {
              ...editingExpense,
              amount: parseFloat(editingExpense.amount),
            }
          : expense
      );

      setExpenses(updatedExpenses);
      
      // Apply current filters to updated expenses
      applyFilters(updatedExpenses);

      // Close modal and reset editing state
      setShowEditExpenseModal(false);
      setEditingExpense(null);
    } catch (err) {
      console.error("Error updating expense:", err);
      setError("Failed to update expense. Please try again.");
    }
  };

  // Function to handle deleting an expense
  const handleDeleteExpense = async (expenseToDelete) => {
    try {
      // Delete via API
      await enhancedTripService.deleteExpense(expenseToDelete.id);

      // Update local state
      const updatedExpenses = expenses.filter((expense) => expense.id !== expenseToDelete.id);
      setExpenses(updatedExpenses);
      
      // Apply current filters to updated expenses
      applyFilters(updatedExpenses);
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError("Failed to delete expense. Please try again.");
    }
  };

  // Function to apply filters to expenses
  const applyFilters = (expensesToFilter = expenses) => {
    let filtered = [...expensesToFilter];
    
    // Filter by category
    if (filters.category !== "All") {
      filtered = filtered.filter((expense) => expense.category === filters.category);
    }
    
    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter((expense) => expense.date >= filters.dateFrom);
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter((expense) => expense.date <= filters.dateTo);
    }
    
    // Filter by amount range
    if (filters.amountMin) {
      filtered = filtered.filter((expense) => parseFloat(expense.amount) >= parseFloat(filters.amountMin));
    }
    
    if (filters.amountMax) {
      filtered = filtered.filter((expense) => parseFloat(expense.amount) <= parseFloat(filters.amountMax));
    }
    
    setFilteredExpenses(filtered);
  };

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [filters]);

  // Function to export expenses as CSV
  const exportToCSV = () => {
    const headers = ["Category", "Description", "Amount", "Date"];
    const csvData = [
      headers.join(","),
      ...filteredExpenses.map((expense) => 
        [
          expense.category,
          `"${expense.description.replace(/"/g, '""')}"`,
          expense.amount,
          expense.date
        ].join(",")
      )
    ].join("\n");
    
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeTrip}-expenses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render loading state
  if (loading && !upcomingTrips.length) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your expenses...</p>
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
        setActiveTrip={handleChangeTrip}
        user={user}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeTrip={activeTrip}
          activeTripDates={activeTripDates}
          setShowAddExpenseModal={setShowAddExpenseModal}
          user={user}
          title="Expenses"
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

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {activeTrip ? `${activeTrip} Expenses` : "All Expenses"}
              </h2>
              <div className="flex space-x-2">
                <button
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={20} />
                </button>
                <button
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  onClick={exportToCSV}
                >
                  <Download size={20} />
                </button>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
                  onClick={() => setShowAddExpenseModal(true)}
                >
                  <Plus size={16} className="mr-1" />
                  Add Expense
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Category</label>
                    <select
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="All">All Categories</option>
                      <option value="Food">Food</option>
                      <option value="Transport">Transport</option>
                      <option value="Accommodation">Accommodation</option>
                      <option value="Activities">Activities</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">From Date</label>
                    <input
                      type="date"
                      name="dateFrom"
                      value={filters.dateFrom}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">To Date</label>
                    <input
                      type="date"
                      name="dateTo"
                      value={filters.dateTo}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">Min $</label>
                      <input
                        type="number"
                        name="amountMin"
                        value={filters.amountMin}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">Max $</label>
                      <input
                        type="number"
                        name="amountMax"
                        value={filters.amountMax}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <ExpenseTable
              recentExpenses={filteredExpenses}
              getCategoryIcon={getCategoryIcon}
              handleDeleteExpense={handleDeleteExpense}
              handleEditExpense={handleEditExpense}
              emptyState={
                <div className="text-center py-8 text-gray-500">
                  {filters.category !== "All" || filters.dateFrom || filters.dateTo || 
                   filters.amountMin || filters.amountMax
                    ? "No expenses match your filters."
                    : "No expenses recorded for this trip yet."}
                </div>
              }
            />
          </div>
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
    </div>
  );
};

export default Expenses;