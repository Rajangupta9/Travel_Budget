import React from "react";
import { Edit, Trash, ChevronRight } from "lucide-react";

const ExpenseTable = ({ recentExpenses, getCategoryIcon, handleDeleteExpense }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium">Recent Expenses</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getCategoryIcon(expense.category)}
                      <span className="ml-2 text-sm text-gray-900">
                        {expense.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${parseFloat(expense.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      <Edit size={16} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteExpense(index)}
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No expenses recorded yet. Add your first expense!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {recentExpenses.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <a
            href="#"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            <span>View all expenses</span>
            <ChevronRight size={16} className="ml-1" />
          </a>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
