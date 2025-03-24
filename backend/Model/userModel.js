const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "please use a valid email address"],
  },
  password: { type: String, required: true, minlength: 6 },
  premiumPlan: { type: Boolean, default: false },
  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
  resetOtp: {
    type: String,
    default: null,
  },
  resetOtpExpires: {
    type: Date,
    default: null,
    get: function(date) {
      // Convert to Indian Standard Time (IST = UTC+5:30)
      if (date) {
        return new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
      }
      return date;
    },
    set: function(date) {
      // For expiration dates, we store directly as provided
      return date;
    }
  },
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpires: {
    type: Date,
    default: null,
    get: function(date) {
      // Convert to Indian Standard Time (IST = UTC+5:30)
      if (date) {
        return new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
      }
      return date;
    },
    set: function(date) {
      // For expiration dates, we store directly as provided
      return date;
    }
  },
  createdAt: {
    type: Date,
    default: function() {
      // Set default to current time in IST
      return new Date(Date.now() + (5.5 * 60 * 60 * 1000));
    },
    get: function(date) {
      // Convert to Indian Standard Time (IST = UTC+5:30)
      if (date) {
        return new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
      }
      return date;
    }
  },
}, {
  timestamps: {
    currentTime: () => new Date(Date.now() + (5.5 * 60 * 60 * 1000))
  },
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true }
});

// Utility method to format dates in IST
userSchema.methods.formatDate = function(date) {
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Utility method to check if reset token/OTP is expired
userSchema.methods.isResetExpired = function(type) {
  const now = new Date(Date.now() + (5.5 * 60 * 60 * 1000)); // Current time in IST
  
  if (type === 'otp' && this.resetOtpExpires) {
    return now > this.resetOtpExpires;
  } else if (type === 'token' && this.resetTokenExpires) {
    return now > this.resetTokenExpires;
  }
  
  return true; // Default to expired if no valid expiration exists
};

// Helper method to set reset token with proper IST expiration
userSchema.methods.setResetToken = function(token, expiresInMinutes = 60) {
  const now = new Date(Date.now() + (5.5 * 60 * 60 * 1000)); // Current time in IST
  this.resetToken = token;
  this.resetTokenExpires = new Date(now.getTime() + (expiresInMinutes * 60 * 1000));
};

// Helper method to set reset OTP with proper IST expiration
userSchema.methods.setResetOtp = function(otp, expiresInMinutes = 10) {
  const now = new Date(Date.now() + (5.5 * 60 * 60 * 1000)); // Current time in IST
  this.resetOtp = otp;
  this.resetOtpExpires = new Date(now.getTime() + (expiresInMinutes * 60 * 1000));
};

const User = mongoose.model("User", userSchema);

module.exports = User;