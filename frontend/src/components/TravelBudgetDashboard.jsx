import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Compass,
  CreditCard,
  Calendar,
  Map,
  Settings,
  LogOut,
  Plus,
  ChevronRight,
  TrendingUp,
  Briefcase,
  Coffee,
  Home,
  DollarSign,
  User,
  Menu,
  X,
  Edit,
  Trash,
} from "lucide-react";

const TravelBudgetDashboard = () => {
  // State management
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTrip, setActiveTrip] = useState("Japan Trip");
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: "Food",
    description: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [newTrip, setNewTrip] = useState({
    name: "",
    dates: "",
    budget: "",
  });
  const [upcomingTrips, setUpcomingTrips] = useState([
    {
      name: "Japan Trip",
      dates: "May 15 - May 23, 2025",
      budget: 3800,
      spent: 3100,
    },
    {
      name: "Bali Getaway",
      dates: "July 10 - July 18, 2025",
      budget: 2500,
      spent: 0,
    },
    {
      name: "Europe Tour",
      dates: "Sep 5 - Sep 19, 2025",
      budget: 5000,
      spent: 0,
    },
  ]);
  const [recentExpenses, setRecentExpenses] = useState([
    {
      category: "Food",
      description: "Sushi Restaurant",
      amount: 85,
      date: "Mar 19, 2025",
    },
    {
      category: "Transport",
      description: "Subway Pass",
      amount: 25,
      date: "Mar 19, 2025",
    },
    {
      category: "Accommodation",
      description: "Hotel - Day 5",
      amount: 180,
      date: "Mar 18, 2025",
    },
    {
      category: "Activities",
      description: "Museum Tickets",
      amount: 45,
      date: "Mar 18, 2025",
    },
    {
      category: "Food",
      description: "Breakfast Cafe",
      amount: 32,
      date: "Mar 18, 2025",
    },
  ]);
  const [pieData, setPieData] = useState([
    { name: "Accommodation", value: 1200, color: "#4f46e5" },
    { name: "Transportation", value: 800, color: "#8b5cf6" },
    { name: "Food", value: 500, color: "#ec4899" },
    { name: "Activities", value: 400, color: "#f97316" },
    { name: "Shopping", value: 200, color: "#14b8a6" },
  ]);
  const [barData, setBarData] = useState([
    { day: "Day 1", spent: 220, budget: 300 },
    { day: "Day 2", spent: 280, budget: 300 },
    { day: "Day 3", spent: 340, budget: 300 },
    { day: "Day 4", spent: 290, budget: 300 },
    { day: "Day 5", spent: 180, budget: 300 },
    { day: "Day 6", spent: 250, budget: 300 },
    { day: "Day 7", spent: 290, budget: 300 },
  ]);
  const [currentTripData, setCurrentTripData] = useState({
    totalBudget: 3800,
    spent: 3100,
    dailyAverage: 443,
    dailyTarget: 475,
    remainingBudget: 700,
    daysRemaining: 2,
  });

  // Update trip data when active trip changes
  useEffect(() => {
    const trip = upcomingTrips.find((trip) => trip.name === activeTrip);
    if (trip) {
      const daysRemaining = 2; // For demo purposes
      const spent = trip.spent;
      const dailyAverage = Math.round(spent / (8 - daysRemaining)); // Assuming 8-day trips

      setCurrentTripData({
        totalBudget: trip.budget,
        spent: spent,
        dailyAverage: dailyAverage,
        dailyTarget: Math.round(trip.budget / 8),
        remainingBudget: trip.budget - spent,
        daysRemaining: daysRemaining,
      });
    }
  }, [activeTrip, upcomingTrips]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Food":
        return <Coffee className="text-pink-500" />;
      case "Transport":
        return <Compass className="text-purple-500" />;
      case "Accommodation":
        return <Home className="text-indigo-500" />;
      case "Activities":
        return <Briefcase className="text-orange-500" />;
      default:
        return <DollarSign className="text-teal-500" />;
    }
  };

  // Function to add a new expense
  const handleAddExpense = (e) => {
    e.preventDefault();

    // Create new expense object
    const expense = {
      category: newExpense.category,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };

    // Update expenses list
    setRecentExpenses([expense, ...recentExpenses]);

    // Update pie chart data
    const updatedPieData = [...pieData];
    const categoryIndex = updatedPieData.findIndex(
      (item) =>
        item.name.toLowerCase() === expense.category.toLowerCase() ||
        (expense.category === "Transport" && item.name === "Transportation")
    );

    if (categoryIndex !== -1) {
      updatedPieData[categoryIndex].value += expense.amount;
    }
    setPieData(updatedPieData);

    // Update current trip spent amount
    const updatedTrips = upcomingTrips.map((trip) => {
      if (trip.name === activeTrip) {
        return {
          ...trip,
          spent: trip.spent + expense.amount,
        };
      }
      return trip;
    });
    setUpcomingTrips(updatedTrips);

    // Close modal and reset form
    setShowAddExpenseModal(false);
    setNewExpense({
      category: "Food",
      description: "",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
    });
  };

  // Function to add a new trip
  const handleAddTrip = (e) => {
    e.preventDefault();

    // Create new trip object
    const trip = {
      name: newTrip.name,
      dates: newTrip.dates,
      budget: parseFloat(newTrip.budget),
      spent: 0,
    };

    // Update trips list
    setUpcomingTrips([...upcomingTrips, trip]);

    // Close modal and reset form
    setShowAddTripModal(false);
    setNewTrip({
      name: "",
      dates: "",
      budget: "",
    });
  };

  // Function to delete an expense
  const handleDeleteExpense = (index) => {
    const expense = recentExpenses[index];

    // Update expenses list
    const updatedExpenses = [...recentExpenses];
    updatedExpenses.splice(index, 1);
    setRecentExpenses(updatedExpenses);

    // Update pie chart data
    const updatedPieData = [...pieData];
    const categoryIndex = updatedPieData.findIndex(
      (item) =>
        item.name.toLowerCase() === expense.category.toLowerCase() ||
        (expense.category === "Transport" && item.name === "Transportation")
    );

    if (categoryIndex !== -1) {
      updatedPieData[categoryIndex].value -= expense.amount;
    }
    setPieData(updatedPieData);

    // Update current trip spent amount
    const updatedTrips = upcomingTrips.map((trip) => {
      if (trip.name === activeTrip) {
        return {
          ...trip,
          spent: Math.max(0, trip.spent - expense.amount),
        };
      }
      return trip;
    });
    setUpcomingTrips(updatedTrips);
  };

  // Add Expense Modal
  const ExpenseModal = () => {
    if (!showAddExpenseModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Add New Expense</h2>
            <button
              onClick={() => setShowAddExpenseModal(false)}
              className="p-1"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleAddExpense}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newExpense.category}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, category: e.target.value })
                }
                required
              >
                <option value="Food">Food</option>
                <option value="Transport">Transportation</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Activities">Activities</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, description: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: e.target.value })
                }
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddExpenseModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add Trip Modal
  const TripModal = () => {
    if (!showAddTripModal) return null;

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

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dates
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newTrip.dates}
                onChange={(e) =>
                  setNewTrip({ ...newTrip, dates: e.target.value })
                }
                placeholder="e.g. Apr 10 - Apr 18, 2025"
                required
              />
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

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
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
          <div className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-700 rounded-lg cursor-pointer">
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </div>

          {isSidebarOpen && (
            <div className="mt-4 pt-4 border-t border-indigo-700 flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <User size={16} />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Alex Morgan</p>
                <p className="text-xs text-indigo-300">Premium Plan</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{activeTrip}</h1>
              <p className="text-sm text-gray-500">
                Keep track of your travel expenses and stay within budget
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Export
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700"
                onClick={() => setShowAddExpenseModal(true)}
              >
                <Plus size={16} className="inline mr-1" />
                Add Expense
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Budget Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-medium text-gray-500">
                  Total Budget
                </h2>
                <DollarSign size={20} className="text-indigo-600" />
              </div>
              <div className="flex items-end">
                <p className="text-3xl font-bold text-gray-900">
                  ${currentTripData.totalBudget.toLocaleString()}
                </p>
                <p className="ml-2 text-sm text-gray-500">USD</p>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (currentTripData.spent / currentTripData.totalBudget) *
                          100
                      )
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {Math.round(
                  (currentTripData.spent / currentTripData.totalBudget) * 100
                )}
                % of your budget used
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-medium text-gray-500">
                  Daily Average
                </h2>
                <Calendar size={20} className="text-purple-600" />
              </div>
              <div className="flex items-end">
                <p className="text-3xl font-bold text-gray-900">
                  ${currentTripData.dailyAverage}
                </p>
                <p className="ml-2 text-sm text-gray-500">per day</p>
              </div>
              <div className="mt-4 flex items-center">
                <span
                  className={`flex items-center text-sm ${
                    currentTripData.dailyAverage < currentTripData.dailyTarget
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  <TrendingUp size={16} className="mr-1" />
                  {currentTripData.dailyAverage < currentTripData.dailyTarget
                    ? `${Math.round(
                        ((currentTripData.dailyTarget -
                          currentTripData.dailyAverage) /
                          currentTripData.dailyTarget) *
                          100
                      )}% under daily budget`
                    : `${Math.round(
                        ((currentTripData.dailyAverage -
                          currentTripData.dailyTarget) /
                          currentTripData.dailyTarget) *
                          100
                      )}% over daily budget`}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Target: ${currentTripData.dailyTarget}/day
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-medium text-gray-500">Remaining</h2>
                <CreditCard size={20} className="text-teal-600" />
              </div>
              <div className="flex items-end">
                <p className="text-3xl font-bold text-gray-900">
                  ${currentTripData.remainingBudget}
                </p>
                <p className="ml-2 text-sm text-gray-500">USD</p>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-gray-700 text-sm">
                  {currentTripData.daysRemaining} days remaining
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                $
                {Math.round(
                  currentTripData.remainingBudget /
                    currentTripData.daysRemaining
                )}{" "}
                per remaining day
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Expense Breakdown
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs text-gray-600">
                      {item.name}: ${item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Daily Spending
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                    <Legend />
                    <Bar dataKey="spent" name="Spent" fill="#8b5cf6" />
                    <Bar dataKey="budget" name="Budget" fill="#e0e0e0" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white rounded-xl shadow mb-6">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Recent Expenses
                </h2>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentExpenses.map((expense, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              {getCategoryIcon(expense.category)}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {expense.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {expense.description}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {expense.date}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <span className="text-gray-900">
                            ${expense.amount}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-700">
                              <Edit size={16} />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteExpense(i)}
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Upcoming Trips */}
          <div className="bg-white rounded-xl shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Upcoming Trips
                </h2>
                <button
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  onClick={() => setShowAddTripModal(true)}
                >
                  Add Trip
                </button>
              </div>
              <div className="space-y-4">
                {upcomingTrips.map((trip) => (
                  <div
                    key={trip.name}
                    className={`p-4 rounded-lg border ${
                      trip.name === activeTrip
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {trip.name}
                        </h3>
                        <p className="text-sm text-gray-500">{trip.dates}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${trip.budget}
                        </p>
                        <p className="text-sm text-gray-500">
                          {trip.spent > 0
                            ? `$${trip.spent} spent`
                            : "No expenses yet"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{
                          width: `${
                            trip.spent > 0
                              ? Math.min(
                                  100,
                                  Math.round((trip.spent / trip.budget) * 100)
                                )
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button
                        className={`text-sm font-medium flex items-center ${
                          trip.name === activeTrip
                            ? "text-indigo-600"
                            : "text-gray-500 hover:text-indigo-600"
                        }`}
                        onClick={() => setActiveTrip(trip.name)}
                      >
                        {trip.name === activeTrip
                          ? "Currently viewing"
                          : "View details"}
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <ExpenseModal />
      <TripModal />
    </div>
  );
};

export default TravelBudgetDashboard;
