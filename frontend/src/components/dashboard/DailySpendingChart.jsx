import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DailySpendingChart = ({ barData }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
      <h3 className="text-lg font-medium mb-4">Daily Spending</h3>
      <div className="h-64">
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Bar
                dataKey="spent"
                name="Actual Spending"
                fill="#8b5cf6"
              />
              <Bar
                dataKey="budget"
                name="Daily Budget"
                fill="#e0e0e0"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No spending data to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySpendingChart;