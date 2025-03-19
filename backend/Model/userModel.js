const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, require: true, trim: true},
    email: {type: String , unquie: true, require:true, trim:true, lowercase:true,match:[/^\S+@\S+\.\S+$/, 'please use a valid email address']},
    password: {type: String , require:true, minlength: 6},
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('user', userSchema);

module.exports = User
