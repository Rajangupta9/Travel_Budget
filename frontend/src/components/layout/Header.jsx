import React from "react";
import { Plus } from "lucide-react";

const Header = ({ activeTrip, setShowAddExpenseModal }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTrip || "My Trips"}
          </h1>
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
            onClick={() => activeTrip && setShowAddExpenseModal(true)}
            disabled={!activeTrip}
          >
            <Plus size={16} className="inline mr-1" />
            Add Expense
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;