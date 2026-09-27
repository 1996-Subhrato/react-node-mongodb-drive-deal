const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true }, // Registration Year
    manufacturingYear: { type: Number, required: true },
    name: { type: String },
    fuelType: { 
        type: String, 
        enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'], 
        required: true 
    },
    transmissionType: { 
        type: String, 
        enum: ['Manual', 'Automatic', 'CVT'], 
        required: true 
    },
    mileage: { type: Number, required: true },
    kmDriven: { type: Number, required: true },
    engineCapacity: { type: Number, required: true },
    color: { type: String, required: true },
    chassisNumber: { type: String, required: true, unique: true },
    registrationNumber: { type: String, required: true, unique: true },
    insuranceValidity: { type: String, required: true },
    price: { type: Number, required: true },
    ownerType: { 
        type: String, 
        enum: ['First Owner', 'Second Owner', 'Third Owner', 'Fourth or More'], 
        required: true 
    },
    address: { type: String, required: true }, // Current Location/City
    location: { type: String, required: true }, // Specific Area
    contact: { type: String },
    photo: { type: String },
    seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Seller', 
        required: true 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    status: { type: String, enum: ['Available', 'Pending', 'Approved', 'Sold'], default: 'Available' }

}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
