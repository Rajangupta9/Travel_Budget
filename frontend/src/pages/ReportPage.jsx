import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Download, Filter, ChevronLeft, Printer, Share, PieChart, BarChart, CreditCard } from "lucide-react";
import { getProfile } from "../controllers/authController";
import { enhancedTripService } from "./Dashboard";

// Import components
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { getCategoryIcon } from "../utils/categoryIcons";

const ReportPage = () => {
  // Router hooks
  const navigate = useNavigate();

  // State management
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTrip, setActiveTrip] = useState("");
  const [activeTripDates, setActiveTripDates] = useState(null);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("all");
  const [reportSummary, setReportSummary] = useState({
    totalSpent: 0,
    totalBudget: 0,
    remainingBudget: 0,
    categories: {},
    topExpense: null,
    averagePerDay: 0
  });
  const [currentTripData, setCurrentTripData] = useState({
    totalBudget: 0,
    spent: 0,
    dailyAverage: 0,
    dailyTarget: 0,
    remainingBudget: 0,
    daysRemaining: 0,
  });

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
        let tripExpenses;
        try {
          tripExpenses = await enhancedTripService.getExpenses(currentTrip.id);
        } catch (err) {
          // Fall back to mock data if API is not available
          tripExpenses = [
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
            },
          ];
        }

        setExpenses(tripExpenses);

        // Generate pie chart data from expenses
        generatePieChartData(tripExpenses);

        // Generate monthly data from expenses
        generateMonthlyData(tripExpenses);

        // Generate report summary
        generateReportSummary(tripExpenses, currentTrip);

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
  }, [activeTrip, upcomingTrips, dateRange]);

  // Function to generate pie chart data from expenses
  const generatePieChartData = (tripExpenses) => {
    // Filter expenses by date range if needed
    const filteredExpenses = filterExpensesByDateRange(tripExpenses);

    const categories = {
      Food: { value: 0, color: "#ec4899" },
      Transport: { value: 0, color: "#8b5cf6" },
      Accommodation: { value: 0, color: "#4f46e5" },
      Activities: { value: 0, color: "#f97316" },
      Shopping: { value: 0, color: "#14b8a6" },
      Other: { value: 0, color: "#6b7280" },
    };

    // Sum up expenses by category
    filteredExpenses.forEach((expense) => {
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

  // Function to generate monthly data from expenses
  const generateMonthlyData = (tripExpenses) => {
    // Filter expenses by date range if needed
    const filteredExpenses = filterExpensesByDateRange(tripExpenses);

    // Group expenses by month
    const months = {};

    filteredExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!months[monthYear]) {
        months[monthYear] = {
          month: monthYear,
          Food: 0,
          Transport: 0,
          Accommodation: 0,
          Activities: 0,
          Shopping: 0,
          Other: 0,
          total: 0
        };
      }
      
      const amount = parseFloat(expense.amount);
      const category = expense.category;
      
      if (months[monthYear][category]) {
        months[monthYear][category] += amount;
      } else {
        months[monthYear].Other += amount;
      }
      
      months[monthYear].total += amount;
    });

    // Convert to array and sort by date
    const data = Object.values(months).sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA - dateB;
    });

    setMonthlyData(data);
  };

  // Function to generate report summary
  const generateReportSummary = (tripExpenses, currentTrip) => {
    // Filter expenses by date range if needed
    const filteredExpenses = filterExpensesByDateRange(tripExpenses);

    // Calculate total spent
    const totalSpent = filteredExpenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount),
      0
    );

    // Group expenses by category
    const categories = {};
    filteredExpenses.forEach((expense) => {
      const { category, amount } = expense;
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += parseFloat(amount);
    });

    // Find top expense
    let topExpense = null;
    if (filteredExpenses.length > 0) {
      topExpense = [...filteredExpenses].sort(
        (a, b) => parseFloat(b.amount) - parseFloat(a.amount)
      )[0];
    }

    // Calculate average per day
    const dateRange = currentTrip.dates.split(" - ");
    const startDate = new Date(dateRange[0]);
    const endDate = new Date(dateRange[1]);
    const totalDays = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1);
    const averagePerDay = totalSpent / totalDays;

    setReportSummary({
      totalSpent,
      totalBudget: currentTrip.budget,
      remainingBudget: currentTrip.remainingBudget,
      categories,
      topExpense,
      averagePerDay
    });
  };

  // Function to filter expenses by date range
  const filterExpensesByDateRange = (expenses) => {
    if (dateRange === "all") {
      return expenses;
    }

    const today = new Date();
    let startDate;

    switch (dateRange) {
      case "7days":
        startDate = new Date();
        startDate.setDate(today.getDate() - 7);
        break;
      case "30days":
        startDate = new Date();
        startDate.setDate(today.getDate() - 30);
        break;
      case "90days":
        startDate = new Date();
        startDate.setDate(today.getDate() - 90);
        break;
      default:
        return expenses;
    }

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= today;
    });
  };

  // Function to handle date range change
  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

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

  // Function to print report
  const handlePrintReport = () => {
    window.print();
  };

  // Function to export as CSV
  const handleExportCSV = () => {
    // Get filtered expenses
    const filteredExpenses = filterExpensesByDateRange(expenses);
    
    // Create CSV content
    const headers = ["Date", "Category", "Description", "Amount"];
    const csvContent = filteredExpenses.map(expense => 
      `${expense.date},${expense.category},"${expense.description.replace(/"/g, '""')}",${expense.amount}`
    );
    
    // Combine headers and content
    // Combine headers and content
    const csv = [headers.join(","), ...csvContent].join("\n");
    
    // Create downloadable blob
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Create download link and trigger click
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeTrip}_expenses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to share report
  const handleShareReport = () => {
    // Implement share functionality (e.g., email link or copy URL)
    alert("Share functionality will be implemented in a future update.");
  };

  // Function to handle trip change
  const handleTripChange = (tripName) => {
    setActiveTrip(tripName);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        activeTrip={activeTrip}
        upcomingTrips={upcomingTrips}
        onTripChange={handleTripChange}
        onLogout={handleLogout}
        userName={user?.name || ""}
        userPlan={user?.planType || "free"}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          toggleSidebar={toggleSidebar} 
          title="Trip Report" 
          subtitle={activeTrip} 
          dates={activeTripDates}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
              {error}
            </div>
          ) : (
            <>
              {/* Back button and actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <button
                  onClick={handleBackToDashboard}
                  className="inline-flex items-center text-gray-700 hover:text-indigo-600 mb-4 md:mb-0"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Back to Dashboard
                </button>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handlePrintReport}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </button>
                  <button
                    onClick={handleShareReport}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>

              {/* Date filter */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Filter className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="text-lg font-medium">Filter by Date Range</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleDateRangeChange("all")}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      dateRange === "all"
                        ? "bg-indigo-100 text-indigo-800 font-medium"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    All Time
                  </button>
                  <button
                    onClick={() => handleDateRangeChange("7days")}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      dateRange === "7days"
                        ? "bg-indigo-100 text-indigo-800 font-medium"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => handleDateRangeChange("30days")}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      dateRange === "30days"
                        ? "bg-indigo-100 text-indigo-800 font-medium"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Last 30 Days
                  </button>
                  <button
                    onClick={() => handleDateRangeChange("90days")}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      dateRange === "90days"
                        ? "bg-indigo-100 text-indigo-800 font-medium"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Last 90 Days
                  </button>
                </div>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Spent</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    ${reportSummary.totalSpent.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    of ${reportSummary.totalBudget.toFixed(2)} budget
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Remaining Budget</h3>
                  <p className={`text-2xl font-bold ${
                    reportSummary.remainingBudget >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    ${reportSummary.remainingBudget.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {reportSummary.remainingBudget >= 0 ? "still available" : "over budget"}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Average Per Day</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    ${reportSummary.averagePerDay.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    daily spending rate
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Top Expense</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    ${reportSummary.topExpense?.amount.toFixed(2) || "0.00"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {reportSummary.topExpense?.description || "No expenses yet"}
                  </p>
                </div>
              </div>

              {/* Charts section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Pie chart card */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center mb-4">
                    <PieChart className="h-5 w-5 text-indigo-600 mr-2" />
                    <h3 className="text-lg font-medium">Spending by Category</h3>
                  </div>
                  <div className="h-64 flex items-center justify-center">
                    {pieData.length > 0 ? (
                      <div className="w-full h-full flex items-center justify-center">
                        {/* Pie chart would be rendered here */}
                        <div className="text-center">
                          <p className="text-gray-500">Pie chart visualization with data from categories:</p>
                          <ul className="mt-2">
                            {pieData.map((item, index) => (
                              <li key={index} className="inline-flex items-center mr-4 mb-2">
                                <span 
                                  className="inline-block w-3 h-3 mr-1 rounded-full" 
                                  style={{ backgroundColor: item.color }}
                                ></span>
                                <span>{item.name}: ${item.value.toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center">No expense data to display</p>
                    )}
                  </div>
                </div>

                {/* Bar chart card */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center mb-4">
                    <BarChart className="h-5 w-5 text-indigo-600 mr-2" />
                    <h3 className="text-lg font-medium">Monthly Spending Trends</h3>
                  </div>
                  <div className="h-64 flex items-center justify-center">
                    {monthlyData.length > 0 ? (
                      <div className="w-full h-full flex items-center justify-center">
                        {/* Bar chart would be rendered here */}
                        <div className="text-center">
                          <p className="text-gray-500">Bar chart visualization with monthly data:</p>
                          <ul className="mt-2">
                            {monthlyData.map((item, index) => (
                              <li key={index} className="mb-2">
                                <span className="font-medium">{item.month}:</span> ${item.total.toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center">No expense data to display</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Expenses table */}
              <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <div className="flex items-center p-4 border-b border-gray-200">
                  <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-medium">Expense Details</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filterExpensesByDateRange(expenses).length > 0 ? (
                        filterExpensesByDateRange(expenses).map((expense) => (
                          <tr key={expense.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(expense.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                  {getCategoryIcon(expense.category)}
                                </span>
                                <span className="ml-3 text-sm text-gray-900">
                                  {expense.category}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {expense.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                              ${parseFloat(expense.amount).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                            No expenses found for the selected period.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReportPage;