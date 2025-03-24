const mongoose = require('mongoose');
const moment = require('moment-timezone');

const ExpenseSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    set: function(val) {
      // Convert the input date to IST
      return moment(val).tz('Asia/Kolkata').toDate();
    },
    validate: {
      validator: async function(value) {
        // Only run validation on new documents or when date is modified
        if (this.isNew || this.isModified('date')) {
          // Validate that expense date is within trip date range
          const Trip = mongoose.models.Trip || mongoose.model('Trip');
          const trip = await Trip.findById(this.trip);
          if (!trip) return false;
          
          // Compare dates in IST timezone
          const expenseDate = moment(value).tz('Asia/Kolkata');
          const tripStartDate = moment(trip.startDate).tz('Asia/Kolkata');
          const tripEndDate = moment(trip.endDate).tz('Asia/Kolkata');
          
          return expenseDate.isSameOrAfter(tripStartDate) && 
                 expenseDate.isSameOrBefore(tripEndDate);
        }
        return true;
      },
      message: 'Expense date must be within the trip date range'
    }
  },
  notes: {
    type: String,
    trim: true
  },
  processed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { 
    currentTime: () => moment().tz('Asia/Kolkata').toDate() 
  } // Makes createdAt and updatedAt use IST
});

// ISSUE: The post-save middleware can cause infinite recursion when the Expense
// is updated to mark it as processed, which triggers the middleware again
// FIX: Use a more robust approach and check for changes first
ExpenseSchema.post('save', async function() {
  try {
    // Skip if already processed to prevent duplicate updates
    if (this.processed) return;
    
    // Use models.Trip to avoid circular reference issues
    const Trip = mongoose.models.Trip || mongoose.model('Trip');
    const trip = await Trip.findById(this.trip);
    
    if (trip) {
      // Calculate the budget changes
      const updatedRemainingBudget = trip.remainingBudget - this.amount;
      
      // Add this expense to the trip's expenses array if not already there
      const expenseExists = trip.expenses.some(expId => expId.equals(this._id));
      
      // Prepare the update
      const updates = {
        remainingBudget: updatedRemainingBudget,
      };
      
      if (!expenseExists) {
        updates.$push = { expenses: this._id };
      }
      
      // Calculate and update daily average
      const totalSpent = trip.totalBudget - updatedRemainingBudget;
      updates.dailyAverage = totalSpent / trip.durationDays;
      
      // Use findByIdAndUpdate to avoid triggering trip middleware unnecessarily
      await Trip.findByIdAndUpdate(trip._id, updates);
      
      // Mark as processed to prevent duplicate processing - without triggering this middleware again
      await mongoose.model('Expense').findByIdAndUpdate(this._id, { processed: true }, { new: true });
    }
  } catch (error) {
    console.error('Error updating trip after expense creation:', error);
  }
});

// ISSUE: The pre-findOneAndDelete middleware can't directly access the document being deleted
// FIX: Need to query for the expense first, then update the trip
ExpenseSchema.pre('findOneAndDelete', async function() {
  try {
    const expenseId = this.getQuery()._id;
    
    // First get the expense so we have its details
    const expense = await mongoose.model('Expense').findById(expenseId);
    if (!expense) return;
    
    // Now update the trip
    const Trip = mongoose.models.Trip || mongoose.model('Trip');
    
    // Use findOneAndUpdate to streamline the update process
    await Trip.findByIdAndUpdate(expense.trip, {
      // Add expense amount back to budget
      $inc: { remainingBudget: expense.amount },
      // Remove expense from array
      $pull: { expenses: expenseId }
    });
    
    // Now recalculate daily average - needs to be done after the above updates
    const trip = await Trip.findById(expense.trip);
    if (trip) {
      const totalSpent = trip.totalBudget - trip.remainingBudget;
      const dailyAverage = totalSpent / trip.durationDays;
      
      await Trip.findByIdAndUpdate(trip._id, { dailyAverage });
    }
  } catch (error) {
    console.error('Error updating trip after expense deletion:', error);
  }
});

// Added for expense updates
ExpenseSchema.pre('findOneAndUpdate', async function() {
  try {
    const update = this.getUpdate();
    const expenseId = this.getQuery()._id;
    
    // Only process if the amount is being changed
    if (!update.amount) return;
    
    // Get the original expense
    const originalExpense = await mongoose.model('Expense').findById(expenseId);
    if (!originalExpense) return;
    
    // Calculate the amount difference
    const amountDifference = originalExpense.amount - update.amount;
    
    // Update the trip's remaining budget
    const Trip = mongoose.models.Trip || mongoose.model('Trip');
    
    await Trip.findByIdAndUpdate(originalExpense.trip, {
      $inc: { remainingBudget: amountDifference }
    });
    
    // Recalculate daily average
    const trip = await Trip.findById(originalExpense.trip);
    if (trip) {
      const totalSpent = trip.totalBudget - trip.remainingBudget;
      const dailyAverage = totalSpent / trip.durationDays;
      
      await Trip.findByIdAndUpdate(trip._id, { dailyAverage });
    }
  } catch (error) {
    console.error('Error updating trip after expense update:', error);
  }
});

// Use models.Expense to check if model already exists to prevent the OverwriteModelError
const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;