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
      required: true,
      get: function(date) {
        // Convert to Indian Standard Time (IST = UTC+5:30)
        if (date) {
          return new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
        }
        return date;
      }
    },
    end: {
      type: Date,
      required: true,
      get: function(date) {
        // Convert to Indian Standard Time (IST = UTC+5:30)
        if (date) {
          return new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
        }
        return date;
      }
    }
  },
  createdAt: {
    type: Date,
    default: function() {
      // Set default to current time in IST
      return new Date(Date.now() + (5.5 * 60 * 60 * 1000));
    }
  },
  updatedAt: {
    type: Date,
    default: function() {
      // Set default to current time in IST
      return new Date(Date.now() + (5.5 * 60 * 60 * 1000));
    }
  }
}, {
  timestamps: {
    currentTime: () => new Date(Date.now() + (5.5 * 60 * 60 * 1000))
  },
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true }
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
  this.updatedAt = new Date(Date.now() + (5.5 * 60 * 60 * 1000));
  next();
});

// Format date helper method
ReportSchema.methods.formatDate = function(date) {
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;