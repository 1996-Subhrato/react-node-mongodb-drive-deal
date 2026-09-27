const mongoose = require('mongoose');

const purchaseRequestSchema = new mongoose.Schema({
    car: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Car', 
        required: true 
    },
    seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Seller', 
        required: true 
    },
    customer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('PurchaseRequest', purchaseRequestSchema);
