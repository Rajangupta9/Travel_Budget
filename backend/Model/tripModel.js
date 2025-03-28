const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    name: { type: String, default: 'active' },  // Stores active/deactive/upcoming
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tripName: { type: String, required: true, trim: true },
    totalBudget: { type: Number, required: true, min: 0 },
    remainingBudget: { type: Number, min: 0, default: function () { return this.totalBudget; } },
    dailyAverage: { type: Number, min: 0, default: 0 },
    startDate: { 
        type: Date, 
        required: true,
        get: function(date) {
            // Convert to Indian Standard Time (IST = UTC+5:30)
            if (date) {
                return new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
            }
            return date;
        },
        set: function(date) {
            // Store in UTC but adjust for IST input
            if (date) {
                // If the date is already a Date object, use it; otherwise create one
                const dateObj = typeof date === 'string' ? new Date(date) : date;
                return dateObj;
            }
            return date;
        }
    },
    endDate: { 
        type: Date, 
        required: true,
        get: function(date) {
            // Convert to Indian Standard Time (IST = UTC+5:30)
            if (date) {
                return new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
            }
            return date;
        },
        set: function(date) {
            // Store in UTC but adjust for IST input
            if (date) {
                // If the date is already a Date object, use it; otherwise create one
                const dateObj = typeof date === 'string' ? new Date(date) : date;
                return dateObj;
            }
            return date;
        },
        validate: {
            validator: function (value) {
                return value >= this.startDate;
            },
            message: 'End date must be after the start date.'
        }
    },
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }]
}, {
    timestamps: {
        currentTime: () => new Date(Date.now() + (5.5 * 60 * 60 * 1000))
    }, // Adds createdAt and updatedAt automatically with IST
    // This allows us to return virtuals when we convert to JSON
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true }
});

// Virtual for trip duration in days
TripSchema.virtual('durationDays').get(function() {
    return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24)) || 1;
});

// Better function to update status
TripSchema.methods.updateStatus = function() {
    // Use current time in IST
    const today = new Date(Date.now() + (5.5 * 60 * 60 * 1000));
    
    if (today < this.startDate) {
        this.name = 'upcoming';
    } else if (today >= this.startDate && today <= this.endDate) {
        this.name = 'active';
    } else {
        this.name = 'deactive';
    }
    
    return this.name;
};

// Helper method to format dates in IST
TripSchema.methods.formatDate = function(date) {
    return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// ISSUE: The checkTripOverlap function has a logical error in the query.
// It will match against *any* trip including itself during updates.
// FIX: Exclude the current trip ID when checking for overlaps
TripSchema.pre('save', async function(next) {
    try {
        // Always update status before saving
        this.updateStatus();
        
        // Skip overlap check if this is not a new trip and dates haven't changed
        if (!this.isNew && !this.isModified('startDate') && !this.isModified('endDate')) {
            return next();
        }
        
        // Query to find overlapping trips (excluding current trip)
        const overlappingTrip = await mongoose.model('Trip').findOne({
            _id: { $ne: this._id }, // Exclude this trip
            user: this.user,
            $or: [
                { startDate: { $lte: this.endDate }, endDate: { $gte: this.startDate } }
            ]
        });
        
        if (overlappingTrip) {
            return next(new Error('You already have a trip scheduled in this date range.'));
        }
        
        next();
    } catch (error) {
        next(error);
    }
});

// ISSUE: The pre 'findOneAndUpdate' middleware cannot access 'this' as expected
// FIX: Use a different approach for update operations
TripSchema.pre('findOneAndUpdate', async function(next) {
    try {
        const update = this.getUpdate();
        const tripId = this.getQuery()._id;
        
        // If we're not updating dates, skip the overlap check
        if (!update.startDate && !update.endDate) {
            return next();
        }
        
        // Get the current trip
        const currentTrip = await mongoose.model('Trip').findById(tripId);
        if (!currentTrip) {
            return next(new Error('Trip not found'));
        }
        
        // Merge current trip with updates for complete data
        const updatedTripData = {
            ...currentTrip.toObject(),
            ...update
        };
        
        // Check for overlapping trips
        const overlappingTrip = await mongoose.model('Trip').findOne({
            _id: { $ne: tripId },
            user: updatedTripData.user,
            $or: [
                { 
                    startDate: { $lte: updatedTripData.endDate }, 
                    endDate: { $gte: updatedTripData.startDate } 
                }
            ]
        });
        
        if (overlappingTrip) {
            return next(new Error('You already have a trip scheduled in this date range.'));
        }
        
        // Update status based on new dates if needed
        if (update.startDate || update.endDate) {
            // Use current time in IST
            const today = new Date(Date.now() + (5.5 * 60 * 60 * 1000));
            const startDate = update.startDate || currentTrip.startDate;
            const endDate = update.endDate || currentTrip.endDate;
            
            if (today < startDate) {
                update.name = 'upcoming';
            } else if (today >= startDate && today <= endDate) {
                update.name = 'active';
            } else {
                update.name = 'deactive';
            }
        }
        
        next();
    } catch (error) {
        next(error);
    }
});

// Create Trip model
const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);

module.exports = Trip;