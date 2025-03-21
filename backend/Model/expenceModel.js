const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    category: { type: String, required: true }, 
    amount: { type: Number, required: true },
    date: { type: Date, required: true }
});

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
