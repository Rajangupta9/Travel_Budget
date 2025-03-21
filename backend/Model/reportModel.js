const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    totalSpent: { type: Number, required: true },
    breakdown: {
        type: Map,
        of: Number,
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', ReportSchema);
module.exports = Report;
