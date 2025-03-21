const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tripName: { type: String, required: true, trim: true },
    totalBudget: { type: Number, required: true, min: 0 },
    remainingBudget: { type: Number, required: true, min: 0 },
    dailyAverage: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }]
});

const Trip = mongoose.model('Trip', TripSchema);

module.exports = Trip;