const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String , unique: true, required:true, trim:true, lowercase:true,match:[/^\S+@\S+\.\S+$/, 'please use a valid email address']},
    password: {type: String , required:true, minlength: 6},
    resetOtp: {
        type: String,
        default: null
      },
      resetOtpExpires: {
        type: Date,
        default: null
      },
      resetToken: {
        type: String,
        default: null
      },
      resetTokenExpires: {
        type: Date,
        default: null
      },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;
