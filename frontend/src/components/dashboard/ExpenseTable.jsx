import React, { useState } from "react";
import { Edit, Trash, ChevronRight, Filter, Calendar, Search, ArrowUpDown, Tag, Info, Star, FileText, Download, Eye } from "lucide-react";

const ExpenseTable = ({ 
  recentExpenses = [], 
  getCategoryIcon, 
  handleDeleteExpense,
  handleEditExpense,
  currency = "$",
  onViewAll = () => {},
  onSort = () => {},
  onFilter = () => {}
}) => {
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  
  // Calculate total amount
  const totalAmount = recentExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  
  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    onSort(key, direction);
  };
  
  // Get sort indicator
  const getSortIndicator = (columnName) => {
    if (sortConfig.key !== columnName) return null;
    
    return (
      <span className="ml-1 text-gray-500">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };
  
  // Format date based on how recent it is
  const formatDate = (dateString) => {
    const expenseDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if today
    if (expenseDate.toDateString() === today.toDateString()) {
      return `Today, ${expenseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if yesterday
    if (expenseDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${expenseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise return formatted date
    return expenseDate.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Function to highlight search terms
  const highlightText = (text, term) => {
    if (!term || !text) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.toString().split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? <span key={index} className="bg-yellow-200">{part}</span> : part
    );
  };
  
  // Filter expenses based on search term
  const filteredExpenses = searchTerm 
    ? recentExpenses.filter(expense => 
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.amount.toString().includes(searchTerm)
      )
    : recentExpenses;
  
  // Get status badge based on expense properties
  const getStatusBadge = (expense) => {
    if (expense.isRecurring) {
      return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Recurring</span>;
    }
    if (parseFloat(expense.amount) > 100) {
      return <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">High</span>;
    }
    if (expense.tags && expense.tags.includes("business")) {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Business</span>;
    }
    
    return null;
  };
  
  // Expense detail popup
  const renderExpenseDetail = () => {
    if (!selectedExpense) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Expense Details</h3>
            <button 
              onClick={() => setSelectedExpense(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              {getCategoryIcon(selectedExpense.category)}
              <span className="ml-2 text-lg font-medium">{selectedExpense.category}</span>
            </div>
            
            <div className="text-2xl font-bold text-gray-900">
              {currency}{parseFloat(selectedExpense.amount).toFixed(2)}
            </div>
            
            <div className="border-t border-b border-gray-200 py-3">
              <p className="text-gray-700 mb-1"><span className="font-medium">Description:</span> {selectedExpense.description}</p>
              <p className="text-gray-700 mb-1"><span className="font-medium">Date:</span> {formatDate(selectedExpense.date)}</p>
              
              {selectedExpense.paymentMethod && (
                <p className="text-gray-700 mb-1"><span className="font-medium">Payment:</span> {selectedExpense.paymentMethod}</p>
              )}
              
              {selectedExpense.location && (
                <p className="text-gray-700 mb-1"><span className="font-medium">Location:</span> {selectedExpense.location}</p>
              )}
              
              {selectedExpense.tags && selectedExpense.tags.length > 0 && (
                <div className="mt-2">
                  <span className="font-medium text-gray-700">Tags: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedExpense.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-700">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button 
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center"
                onClick={() => {
                  handleEditExpense(selectedExpense);
                  setSelectedExpense(null);
                }}
              >
                <Edit size={16} className="mr-2" />
                Edit
              </button>
              <button 
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center"
                onClick={() => {
                  setConfirmDelete(selectedExpense);
                  setSelectedExpense(null);
                }}
              >
                <Trash size={16} className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Delete confirmation modal
  const renderDeleteConfirmation = () => {
    if (!confirmDelete) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4 p-6">
          <h3 className="text-lg font-medium mb-2">Confirm Deletion</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this expense?
            <br />
            <span className="font-medium">{confirmDelete.description}</span> ({currency}{parseFloat(confirmDelete.amount).toFixed(2)})
          </p>
          
          <div className="flex space-x-3 justify-end">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => setConfirmDelete(null)}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={() => {
                handleDeleteExpense(confirmDelete);
                setConfirmDelete(null);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render row details for expanded view
  const renderExpandedDetails = (expense) => {
    if (expandedRow !== expense.id) return null;
    
    return (
      <tr>
        <td colSpan="5" className="px-6 py-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Additional Details</h4>
              {expense.notes && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Notes:</span> {expense.notes}
                </p>
              )}
              {expense.paymentMethod && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Payment Method:</span> {expense.paymentMethod}
                </p>
              )}
              {expense.location && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Location:</span> {expense.location}
                </p>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Transaction Details</h4>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Transaction ID:</span> {expense.id || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Created:</span> {formatDate(expense.createdAt || expense.date)}
              </p>
              {expense.updatedAt && (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Last Updated:</span> {formatDate(expense.updatedAt)}
                </p>
              )}
            </div>
          </div>
          
          {expense.tags && expense.tags.length > 0 && (
            <div className="mt-3">
              <h4 className="font-medium text-gray-900 mb-1">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {expense.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-200 text-xs rounded-full text-gray-700">{tag}</span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end mt-3">
            <button 
              className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
              onClick={() => setExpandedRow(null)}
            >
              Collapse
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Expenses</h3>
        
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search expenses..."
              className="pl-8 pr-4 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} className="absolute left-2.5 top-2 text-gray-400" />
            {searchTerm && (
              <button 
                className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>
          
          <button 
            className="px-3 py-1 border border-gray-300 rounded-md text-sm flex items-center hover:bg-gray-50"
            onClick={onFilter}
          >
            <Filter size={16} className="mr-1" />
            Filter
          </button>
          
          <button 
            className="px-3 py-1 border border-gray-300 rounded-md text-sm flex items-center hover:bg-gray-50"
            onClick={() => onSort(sortConfig.key, sortConfig.direction === 'asc' ? 'desc' : 'asc')}
          >
            <ArrowUpDown size={16} className="mr-1" />
            Sort
          </button>
        </div>
      </div>
      
      {/* Summary bar */}
      {filteredExpenses.length > 0 && (
        <div className="px-6 py-2 bg-gray-50 text-sm border-b border-gray-200 flex justify-between">
          <span>
            Showing <span className="font-medium">{filteredExpenses.length}</span> expenses
            {searchTerm && <span> (filtered from {recentExpenses.length})</span>}
          </span>
          <span>
            Total: <span className="font-medium">{currency}{totalAmount.toFixed(2)}</span>
          </span>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center">
                  Category
                  {getSortIndicator('category')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center">
                  Description
                  {getSortIndicator('description')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center">
                  Amount
                  {getSortIndicator('amount')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date
                  {getSortIndicator('date')}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense, index) => (
                <React.Fragment key={expense.id || index}>
                  <tr 
                    className={`${
                      expense.id === expandedRow ? 'bg-indigo-50' : 'hover:bg-gray-50'
                    } transition-colors duration-150 cursor-pointer`}
                    onClick={() => setSelectedExpense(expense)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-md bg-indigo-100 text-indigo-600">
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {highlightText(expense.category, searchTerm)}
                          </div>
                          {expense.subcategory && (
                            <div className="text-xs text-gray-500">
                              {expense.subcategory}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm text-gray-900 truncate">
                        {highlightText(expense.description, searchTerm)}
                      </div>
                      <div className="flex items-center mt-1">
                        {getStatusBadge(expense)}
                        {expense.attachments && expense.attachments.length > 0 && (
                          <span className="ml-2 text-xs text-gray-500 flex items-center">
                            <FileText size={12} className="mr-1" />
                            {expense.attachments.length}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className={`font-medium ${parseFloat(expense.amount) > 100 ? 'text-red-600' : 'text-gray-900'}`}>
                        {currency}{highlightText(parseFloat(expense.amount).toFixed(2), searchTerm)}
                      </div>
                      {expense.paymentMethod && (
                        <div className="text-xs text-gray-500">
                          {expense.paymentMethod}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span>{formatDate(expense.date)}</span>
                        {expense.isRecurring && (
                          <span className="text-xs text-indigo-600 flex items-center mt-1">
                            <Calendar size={12} className="mr-1" />
                            Recurring
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedRow(expandedRow === expense.id ? null : expense.id);
                          }}
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="p-1 text-indigo-600 hover:text-indigo-900 rounded-full hover:bg-indigo-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditExpense(expense);
                          }}
                          title="Edit expense"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="p-1 text-red-600 hover:text-red-900 rounded-full hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(expense);
                          }}
                          title="Delete expense"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {renderExpandedDetails(expense)}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center"
                >
                  <div className="flex flex-col items-center">
                    {searchTerm ? (
                      <>
                        <p className="text-gray-500 mb-2">No expenses found matching "{searchTerm}"</p>
                        <button 
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          onClick={() => setSearchTerm("")}
                        >
                          Clear search
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-500 mb-4">No expenses recorded yet.</p>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">
                          Add your first expense
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredExpenses.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {filteredExpenses.length} of {recentExpenses.length} expenses
          </div>
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            <span>View all expenses</span>
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      )}
      
      {/* Modals */}
      {renderExpenseDetail()}
      {renderDeleteConfirmation()}
    </div>
  );
};

export default ExpenseTable;