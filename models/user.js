const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: true // for testing only because i couldn't send verification email during development
    },
    verificationToken: {
        type: String
    },
    treasures:{
        type: Number,
        default: 0
    },
    dailyTreasure: {
        type: Number,
        default: 0
    },
    weeklyTreasure: {
        type: Number,
        default: 0
    },
    dailyTreasureDate: {
        type: Date,
        default: Date.now
    },
    weeklyTreasureDate: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;