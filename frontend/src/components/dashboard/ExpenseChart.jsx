import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Sector
} from "recharts";
import { Plus } from "lucide-react";

const ExpenseChart = ({ 
  activeTrip, 
  setShowAddExpenseModal,
  pieData = [], 
  title = "Expenses by Category",
  currency = "$",
  firstTimeNoExpenses = true // New prop to control first-time no expenses state
}) => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  // Calculate total expenses
  const totalExpenses = pieData.reduce((sum, item) => sum + item.value, 0);
  
  // Sort data by value (largest first) for better visualization
  const sortedData = [...pieData].sort((a, b) => b.value - a.value);
  
  // Custom label renderer for the pie slices
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    // Only show labels for segments that are large enough to be readable
    if (percent < 0.05) return null;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  // Custom active shape for hover effect
  const renderActiveShape = (props) => {
    const { 
      cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, name, value
    } = props;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 14}
          outerRadius={outerRadius + 16}
          fill={fill}
        />
      </g>
    );
  };
  
  // Custom tooltip for more detailed information
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalExpenses) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <div className="flex items-center mb-1">
            <span 
              className="inline-block w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: data.color }}
            ></span>
            <span className="font-medium">{data.name}</span>
          </div>
          <p className="text-gray-700">{currency}{data.value.toFixed(2)}</p>
          <p className="text-sm text-gray-600">{percentage}% of total</p>
          {data.items && (
            <div className="mt-1 text-xs text-gray-500">
              {data.items.length} transactions
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Handler for pie segment hover
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  // Handler for pie segment leave
  const onPieLeave = () => {
    setActiveIndex(null);
  };
  
  // Custom legend that shows amount and percentage
  const CustomLegend = ({ payload }) => {
    return (
      <div className="grid grid-cols-1 gap-2 mt-4 max-h-64 overflow-y-auto custom-scrollbar">
        {payload.map((entry, index) => {
          const item = pieData.find(d => d.name === entry.value);
          const percentage = ((item.value / totalExpenses) * 100).toFixed(1);
          
          return (
            <div 
              key={`legend-${index}`} 
              className="flex justify-between items-center py-1 px-2 rounded hover:bg-gray-50"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm truncate max-w-32">{entry.value}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">{currency}{item.value.toFixed(2)}</span>
                <span className="text-xs text-gray-500 ml-1">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Helper function to render the summary component
  const renderSummary = () => {
    // Get top 3 categories
    const topCategories = sortedData.slice(0, 3);
    
    return (
      <div className="text-sm mb-4">
        <p className="text-gray-700 mb-2">
          Total: <span className="font-bold">{currency}{totalExpenses.toFixed(2)}</span>
        </p>
        <p className="text-gray-600 text-xs">
          Top categories: {topCategories.map(cat => cat.name).join(', ')}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">{title}</h3>
        {pieData.length > 0 && (
          <button
            className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-full transition-colors"
            onClick={() => activeTrip && setShowAddExpenseModal(true)}
            disabled={!activeTrip}
          >
            <Plus size={20} />
          </button>
        )}
      </div>
      
      {/* Summary section */}
      {pieData.length > 0 && renderSummary()}
      
      <div className="h-64">
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                innerRadius={30}
                fill="#8884d8"
                dataKey="value"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                paddingAngle={2}
              >
                {sortedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="#fff"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                content={<CustomLegend />}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <p className="text-gray-500 mb-3">No expense data to display</p>
            {firstTimeNoExpenses && (
              <button
                className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center shadow-sm"
                onClick={() => activeTrip && setShowAddExpenseModal(true)}
                disabled={!activeTrip}
              >
                <Plus size={16} className="mr-1" />
                <span>Add First Expense</span>
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Time period selector */}
      {pieData.length > 0 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button className="px-3 py-1 text-xs border border-gray-300 rounded-full bg-white hover:bg-gray-50">
            Week
          </button>
          <button className="px-3 py-1 text-xs border border-gray-300 rounded-full bg-purple-50 text-purple-700 font-medium">
            Month
          </button>
          <button className="px-3 py-1 text-xs border border-gray-300 rounded-full bg-white hover:bg-gray-50">
            Year
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;