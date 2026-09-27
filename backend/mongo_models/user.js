const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    gender: { type: String, required: true },
    photo: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    status: { type: String, default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
