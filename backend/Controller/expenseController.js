const Expense = require('../Model/expenceModel');
const Trip = require('../Model/tripModel');
const mongoose = require('mongoose');

const createExpense = async (req, res) => {
  try {
    const { trip, category, amount, date, notes } = req.body;
    
    // Validate trip ID format
    if (!mongoose.Types.ObjectId.isValid(trip)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID format' });
    }
    
    // Check if trip exists
    const tripExists = await Trip.findById(trip);
    if (!tripExists) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    
    // Verify the trip belongs to the current user
    if (tripExists.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'You do not have permission to add expenses to this trip' });
    }
    
    // Create new expense
    const newExpense = new Expense({
      trip,
      category,
      amount: parseFloat(amount),
      date: new Date(date),
      notes
    });
    
    // Save expense
    const savedExpense = await newExpense.save();
    
    // Return the newly created expense
    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: savedExpense
    });
    
  } catch (error) {
    console.error('Error creating expense:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating expense'
    });
  }
  };

  const getExpenses = async (req, res) => {
    try {
      const { tripId } = req.query;
      // Check if trip exists and belongs to current user
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      
      if (trip.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to view expenses for this trip' });
      }
      
      const expenses = await Expense.find({ trip: tripId }).sort({ date: -1 });
      res.json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

 const getExpenseById = async (req, res) => {
    try {
      const expense = await Expense.findById(req.params.id).populate('trip');
      
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
      
      // Check if the expense belongs to a trip owned by the current user
      if (expense.trip.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to access this expense' });
      }
      
      res.json(expense);
    } catch (error) {
      console.error('Error fetching expense:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  const updateExpenseWithId =  async (req, res) => {
    try {
      const { category, amount, date } = req.body;
      
      // Find the expense
      const expense = await Expense.findById(req.params.id).populate('trip');
      
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
      
      // Check if the expense belongs to a trip owned by the current user
      if (expense.trip.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this expense' });
      }
      
      // Calculate the difference in amount if it's being updated
      const amountDifference = amount ? amount - expense.amount : 0;
      
      // Update the expense
      const updatedExpense = await Expense.findByIdAndUpdate(
        req.params.id,
        {
          category: category || expense.category,
          amount: amount || expense.amount,
          date: date || expense.date
        },
        { new: true }
      );
      
      // If amount changed, update the trip's remaining budget
      if (amountDifference !== 0) {
        const trip = expense.trip;
        trip.remainingBudget = Math.max(0, trip.remainingBudget - amountDifference);
        await trip.save();
      }
      
      res.json(updatedExpense);
    } catch (error) {
      console.error('Error updating expense:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

 const deleteExpenseWithId = async (req, res) => {
    try {
      // Find the expense with its associated trip
      const expense = await Expense.findById(req.params.id);
      
      if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
      
      // Get the trip to check ownership and update remaining budget
      const trip = await Trip.findById(expense.trip);
      
      if (!trip) {
        return res.status(404).json({ message: 'Associated trip not found' });
      }
      
      // Check if the expense belongs to a trip owned by the current user
      if (trip.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this expense' });
      }
      
      // Delete the expense
      await Expense.findByIdAndDelete(req.params.id);
      
      // Update trip's remaining budget and remove expense from trip's expenses array
      trip.remainingBudget += expense.amount;
      trip.expenses = trip.expenses.filter(
        expenseId => expenseId.toString() !== req.params.id
      );
      await trip.save();
      
      res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  const getExpenseStatistics = async (req, res) => {
    try {
      const { tripId } = req.params;
      
      // Check if trip exists and belongs to current user
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      
      if (trip.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to view stats for this trip' });
      }
      
      // Get all expenses for the trip
      const expenses = await Expense.find({ trip: tripId });
      
      // Calculate statistics
      const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Group by category
      const categoryBreakdown = {};
      expenses.forEach(expense => {
        if (!categoryBreakdown[expense.category]) {
          categoryBreakdown[expense.category] = 0;
        }
        categoryBreakdown[expense.category] += expense.amount;
      });
      
      // Calculate daily spending
      const dailySpending = {};
      expenses.forEach(expense => {
        const dateStr = expense.date.toISOString().split('T')[0];
        if (!dailySpending[dateStr]) {
          dailySpending[dateStr] = 0;
        }
        dailySpending[dateStr] += expense.amount;
      });
      
      res.json({
        totalSpent,
        totalBudget: trip.totalBudget,
        remainingBudget: trip.remainingBudget,
        categoryBreakdown,
        dailySpending
      });
    } catch (error) {
      console.error('Error fetching expense statistics:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  module.exports = {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpenseWithId,
    deleteExpenseWithId,
    getExpenseStatistics};