const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  trip: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Trip', 
    required: true,
    index: true
  },
  totalSpent: { 
    type: Number, 
    required: true,
    min: 0
  },
  breakdown: {
    type: Map,
    of: {
      type: Number,
      min: 0
    },
    required: true,
    default: new Map()
  },
  summary: {
    type: String,
    trim: true
  },
  currency: {
    type: String,
    default: 'USD',
    trim: true
  },
  dateRange: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for efficient queries
ReportSchema.index({ trip: 1, createdAt: -1 });

// Virtual for report duration in days
ReportSchema.virtual('durationDays').get(function() {
  return Math.ceil((this.dateRange.end - this.dateRange.start) / (1000 * 60 * 60 * 24));
});

// Method to calculate average daily spend
ReportSchema.methods.getDailyAverage = function() {
  const days = this.durationDays || 1;
  return this.totalSpent / days;
};

// Static method to find reports by trip
ReportSchema.statics.findByTrip = function(tripId) {
  return this.find({ trip: tripId }).sort({ createdAt: -1 });
};

// Middleware to update timestamps
ReportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;