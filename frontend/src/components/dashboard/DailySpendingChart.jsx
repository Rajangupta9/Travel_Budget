import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const DailySpendingChart = ({ barData = [], title = "Daily Spending" }) => {
  const [activeBar, setActiveBar] = useState(null);
  
  // Calculate totals for the summary
  const totalSpent = barData.reduce((sum, day) => sum + (day.spent || 0), 0);
  const totalBudget = barData.reduce((sum, day) => sum + (day.budget || 0), 0);
  const difference = totalBudget - totalSpent;
  const percentOfBudget = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  // Find max value for better Y-axis scaling
  const maxValue = Math.max(
    ...barData.map(item => Math.max(item.spent || 0, item.budget || 0))
  ) * 1.1; // Add 10% padding
  
  // Custom tooltip to enhance the data presentation
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const spent = payload[0].value;
      const budget = payload[1]?.value || 0;
      const diff = budget - spent;
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-purple-600">Spent: ${spent.toFixed(2)}</p>
          <p className="text-gray-600">Budget: ${budget.toFixed(2)}</p>
          <p className={`font-medium ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {diff >= 0 ? 'Under budget: ' : 'Over budget: '}
            ${Math.abs(diff).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Handle bar click for interactive features
  const handleBarClick = (data, index) => {
    setActiveBar(activeBar === index ? null : index);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="text-sm text-gray-600">
          <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-1"></span> Actual
          <span className="inline-block w-3 h-3 bg-gray-300 rounded-full ml-4 mr-1"></span> Budget
        </div>
      </div>
      
      {/* Summary section */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs text-gray-500">Total Spent</p>
          <p className="text-lg font-medium text-purple-700">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs text-gray-500">Total Budget</p>
          <p className="text-lg font-medium text-gray-700">${totalBudget.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs text-gray-500">Budget Usage</p>
          <p className={`text-lg font-medium ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {percentOfBudget.toFixed(1)}%
          </p>
        </div>
      </div>
      
      <div className="h-64">
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={barData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `$${value}`}
                domain={[0, maxValue]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ marginTop: 10 }} />
              
              {/* Add reference line for overall average spending */}
              <ReferenceLine 
                y={totalSpent / barData.length} 
                stroke="#8b5cf6" 
                strokeDasharray="3 3"
                strokeWidth={2}
                label={{ value: "Avg", position: "insideTopLeft", fill: "#8b5cf6" }} 
              />
              
              <Bar
                dataKey="spent"
                name="Actual Spending"
                fill="#8b5cf6"
                fillOpacity={(data, index) => activeBar === index ? 1 : 0.8}
                stroke="#7c3aed"
                strokeWidth={1}
                radius={[4, 4, 0, 0]}
                onClick={handleBarClick}
                animationDuration={300}
              />
              <Bar
                dataKey="budget"
                name="Daily Budget"
                fill="#e0e0e0"
                stroke="#d1d5db"
                radius={[4, 4, 0, 0]}
                strokeWidth={1}
                onClick={handleBarClick}
                animationDuration={300}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 mb-2">No spending data to display</p>
              <button className="text-sm text-purple-600 hover:text-purple-800">
                Add your first expense
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Date range selector (placeholder) */}
      <div className="mt-4 flex justify-center space-x-2">
        <button className="px-3 py-1 text-xs border border-gray-300 rounded-full bg-white hover:bg-gray-50">
          Week
        </button>
        <button className="px-3 py-1 text-xs border border-gray-300 rounded-full bg-purple-50 text-purple-700 font-medium">
          Month
        </button>
        <button className="px-3 py-1 text-xs border border-gray-300 rounded-full bg-white hover:bg-gray-50">
          Quarter
        </button>
      </div>
    </div>
  );
};

export default DailySpendingChart;