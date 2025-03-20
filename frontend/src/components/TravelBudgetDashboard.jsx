import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Compass, CreditCard, Calendar, Map, Settings, LogOut, Plus, ChevronRight, TrendingUp, Briefcase, Coffee, Home, DollarSign, User, Menu, X } from 'lucide-react';

const TravelBudgetDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTrip, setActiveTrip] = useState('Japan Trip');

  // Sample data
  const pieData = [
    { name: 'Accommodation', value: 1200, color: '#4f46e5' },
    { name: 'Transportation', value: 800, color: '#8b5cf6' },
    { name: 'Food', value: 500, color: '#ec4899' },
    { name: 'Activities', value: 400, color: '#f97316' },
    { name: 'Shopping', value: 200, color: '#14b8a6' }
  ];

  const barData = [
    { day: 'Day 1', spent: 220, budget: 300 },
    { day: 'Day 2', spent: 280, budget: 300 },
    { day: 'Day 3', spent: 340, budget: 300 },
    { day: 'Day 4', spent: 290, budget: 300 },
    { day: 'Day 5', spent: 180, budget: 300 },
    { day: 'Day 6', spent: 250, budget: 300 },
    { day: 'Day 7', spent: 290, budget: 300 },
  ];

  const upcomingTrips = [
    { name: 'Japan Trip', dates: 'May 15 - May 23, 2025', budget: 3800, spent: 3100 },
    { name: 'Bali Getaway', dates: 'July 10 - July 18, 2025', budget: 2500, spent: 0 },
    { name: 'Europe Tour', dates: 'Sep 5 - Sep 19, 2025', budget: 5000, spent: 0 }
  ];

  const recentExpenses = [
    { category: 'Food', description: 'Sushi Restaurant', amount: 85, date: 'Mar 19, 2025' },
    { category: 'Transport', description: 'Subway Pass', amount: 25, date: 'Mar 19, 2025' },
    { category: 'Accommodation', description: 'Hotel - Day 5', amount: 180, date: 'Mar 18, 2025' },
    { category: 'Activities', description: 'Museum Tickets', amount: 45, date: 'Mar 18, 2025' },
    { category: 'Food', description: 'Breakfast Cafe', amount: 32, date: 'Mar 18, 2025' },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Food': return <Coffee className="text-pink-500" />;
      case 'Transport': return <Compass className="text-purple-500" />;
      case 'Accommodation': return <Home className="text-indigo-500" />;
      case 'Activities': return <Briefcase className="text-orange-500" />;
      default: return <DollarSign className="text-teal-500" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className={`bg-indigo-800 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}>
        <div className="p-5 flex items-center justify-between">
          {isSidebarOpen && <h1 className="text-xl font-bold">TravelBudget</h1>}
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-indigo-700">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 pt-4">
            <div className="space-y-1">
              <a href="#" className="flex items-center px-4 py-3 text-white bg-indigo-700 rounded-lg">
                <Compass size={20} />
                {isSidebarOpen && <span className="ml-3">Dashboard</span>}
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-700 rounded-lg">
                <CreditCard size={20} />
                {isSidebarOpen && <span className="ml-3">Expenses</span>}
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-700 rounded-lg">
                <Calendar size={20} />
                {isSidebarOpen && <span className="ml-3">Trip Planner</span>}
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-700 rounded-lg">
                <Map size={20} />
                {isSidebarOpen && <span className="ml-3">Destinations</span>}
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-indigo-100 hover:bg-indigo-700 rounded-lg">
                <TrendingUp size={20} />
                {isSidebarOpen && <span className="ml-3">Reports</span>}
              </a>
            </div>
            
            {isSidebarOpen && (
              <div className="mt-8">
                <h2 className="px-4 text-xs font-semibold text-indigo-200 uppercase tracking-wider">My Trips</h2>
                <div className="mt-2 space-y-1">
                  {upcomingTrips.map(trip => (
                    <button 
                      key={trip.name}
                      className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${trip.name === activeTrip ? 'bg-indigo-600 text-white' : 'text-indigo-100 hover:bg-indigo-700'}`}
                      onClick={() => setActiveTrip(trip.name)}
                    >
                      <span className="truncate">{trip.name}</span>
                    </button>
                  ))}
                  
                  <button className="w-full flex items-center px-4 py-2 mt-1 text-sm text-indigo-100 hover:bg-indigo-700 rounded-lg">
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
              <p className="text-sm text-gray-500">Keep track of your travel expenses and stay within budget</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Export
              </button>
              <button className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700">
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
                <h2 className="text-sm font-medium text-gray-500">Total Budget</h2>
                <DollarSign size={20} className="text-indigo-600" />
              </div>
              <div className="flex items-end">
                <p className="text-3xl font-bold text-gray-900">$3,800</p>
                <p className="ml-2 text-sm text-gray-500">USD</p>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '82%' }}></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">82% of your budget used</p>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-medium text-gray-500">Daily Average</h2>
                <Calendar size={20} className="text-purple-600" />
              </div>
              <div className="flex items-end">
                <p className="text-3xl font-bold text-gray-900">$443</p>
                <p className="ml-2 text-sm text-gray-500">per day</p>
              </div>
              <div className="mt-4 flex items-center">
                <span className="flex items-center text-green-600 text-sm">
                  <TrendingUp size={16} className="mr-1" />
                  8% under daily budget
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Target: $475/day</p>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-medium text-gray-500">Remaining</h2>
                <CreditCard size={20} className="text-teal-600" />
              </div>
              <div className="flex items-end">
                <p className="text-3xl font-bold text-gray-900">$700</p>
                <p className="ml-2 text-sm text-gray-500">USD</p>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-gray-700 text-sm">
                  2 days remaining
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">$350 per remaining day</p>
            </div>
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Expense Breakdown</h2>
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
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs text-gray-600">{item.name}: ${item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Daily Spending</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
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
                <h2 className="text-lg font-medium text-gray-900">Recent Expenses</h2>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
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
                              <div className="text-sm font-medium text-gray-900">{expense.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{expense.description}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{expense.date}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <span className="text-gray-900">${expense.amount}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-700">
                            <ChevronRight size={16} />
                          </button>
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
                <h2 className="text-lg font-medium text-gray-900">Upcoming Trips</h2>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  <Plus size={16} className="inline mr-1" />
                  Add Trip
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingTrips.map((trip) => (
                  <div key={trip.name} className={`p-4 rounded-lg border-2 ${trip.name === activeTrip ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start">
                      <h3 className="text-md font-medium text-gray-900">{trip.name}</h3>
                      {trip.name === activeTrip && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{trip.dates}</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Budget:</span>
                        <span className="font-medium text-gray-900">${trip.budget}</span>
                      </div>
                      {trip.spent > 0 && (
                        <div className="mt-1 flex justify-between text-sm">
                          <span className="text-gray-500">Spent:</span>
                          <span className="font-medium text-gray-900">${trip.spent}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <button className={`w-full py-2 text-sm font-medium rounded-lg ${trip.name === activeTrip ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'}`}>
                        {trip.name === activeTrip ? 'View Details' : 'Select Trip'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TravelBudgetDashboard;