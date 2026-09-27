const User = require('../mongo_models/user');
const PurchaseRequest = require('../mongo_models/purchase_request');
const Car = require('../mongo_models/car');
const Review = require('../mongo_models/review');
const Seller = require('../mongo_models/seller');

var userController = {};
const jwt = require('jsonwebtoken');
const secret_key = 'abcd#$%@12345678';
const emailService = require('../utils/emailService');

userController.renderSignUpPage=(req,res)=>
{
    res.json({ success: true, message: "User signup endpoint reached. Please POST details to /register." });
}
userController.renderLoginPage=(req,res)=>
{
    res.json({ success: true, message: "User login endpoint reached. Please POST credentials to /login." });
}
//register usersPic and login usersPic
userController.registerUser = async (req, res) => {
    try {
        var {email} = req.body;
        const [userExists, sellerExists] = await Promise.all([
            User.findOne({ email }),
            Seller.findOne({ email })
        ]);

        if (!userExists && !sellerExists) {
            var {photo} = req.files;
            var server_path = `public/usersPic/${photo.name}`;
            var db_path = `/usersPic/${photo.name}`;
            photo.mv(server_path, async (error) => {
                if (error) {
                    res.status(500).json({ success: false, message: "Failed to upload photo", error: error.message });
                } else {
                    try {
                        req.body.photo = db_path;
                        // Remove status from body to use default 'Active'
                        delete req.body.status;
                        
                        await User.create(req.body);

                        // Send Welcome Email (async)
                        emailService.sendUserWelcomeEmail(req.body);

                        res.json({ success: true, message: "User registered Successfully" });
                    } catch (e) {
                        res.status(500).json({ success: false, message: "Failed to register user", error: e.message });
                    }
                }
            });
        } else {
            const collisionType = userExists ? "User" : "Seller";
            res.status(400).json({ success: false, message: `${collisionType} with this email already exists` });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
userController.loginUser = async (req, res) => {
    try {
        var {email, password} = req.body;
        var result = await User.findOne({
            email: email,
            password: password
        });
        if (result) {
            if (result.status === 'Active') {
                var payload = {
                    id: result._id,
                    email: result.email,
                    name: result.first_name,
                    first_name: result.first_name
                }
                var token = jwt.sign(payload, secret_key, {expiresIn: '1D'});
                res.cookie('UserToken', token);
                res.json({ success: true, data: { token, user: payload }, message: "Login Successful" });
            } else {
                res.status(403).json({ success: false, message: "User Blocked By Admin", error: "Forbidden" });
            }
        } else {
            res.status(401).json({ success: false, message: "Invalid Credentials", error: "Authentication Failed" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
userController.getStats = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [totalCount, pendingCount, soldCount] = await Promise.all([
            PurchaseRequest.countDocuments({ customer: userId }),
            PurchaseRequest.countDocuments({ customer: userId, status: 'Pending' }),
            PurchaseRequest.countDocuments({ customer: userId, status: 'Sold' })
        ]);

        res.json({
            success: true,
            data: {
                total: totalCount,
                pending: pendingCount,
                sold: soldCount
            }
        });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch stats", error: e.message });
    }
}
userController.renderDashboard=(req,res)=>
{
    res.json({ success: true, data: { name: req.user.name }, message: "User Dashboard accessed successfully" });
}
userController.checkToken = (req, res) => {
    if (req.user) {
        res.json({ success: true, message: "Token is valid", data: req.user });
    } else {
        res.status(401).json({ success: false, message: "Unauthorized", error: "No token found" });
    }
}
userController.logoutUser = (req, res) => {
    res.clearCookie('UserToken');
    res.json({ success: true, message: "Logged out successfully" });
}
userController.renderProfile = (req, res) => {
    res.json({ success: true, message: "User Profile endpoint accessed successfully" });
}
userController.showProfile = async (req, res) => {
    try {
        var {id} = req.user;
        var record = await User.findById(id);
        if (record) {
            res.json({ success: true, data: record, message: "Profile fetched successfully" });
        } else {
            res.status(404).json({ success: false, message: "User profile not found", error: "Not Found" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
userController.updateProfile = async (req, res) => {
    try {
        let id = req.params.id;
        if (!id || id === 'undefined' || id === 'null') {
            id = req.user.id;
        }

        const updateData = { ...req.body };
        // Prevent accidental email/password overwrite
        delete updateData.email;
        delete updateData.password;

        if (req.files && req.files.photo) {
            const photo = req.files.photo;
            const extension = photo.name.split('.').pop();
            const fileName = `user_${id}_${Date.now()}.${extension}`;
            const server_path = `public/usersPic/${fileName}`;
            const db_path = `/usersPic/${fileName}`;

            photo.mv(server_path, async (error) => {
                if (error) {
                    console.error("File move error:", error);
                    return res.status(500).json({ success: false, message: "Failed to upload photo", error: error.message });
                }
                updateData.photo = db_path;
                try {
                    await User.findByIdAndUpdate(id, updateData);
                    return res.json({ success: true, message: "Profile Updated Successfully with Photo" });
                } catch (dbError) {
                    return res.status(500).json({ success: false, message: "Failed to update database", error: dbError.message });
                }
            });
        } else {
            try {
                await User.findByIdAndUpdate(id, updateData);
                return res.json({ success: true, message: "Profile Details Updated Successfully" });
            } catch (dbError) {
                return res.status(500).json({ success: false, message: "Failed to update profile", error: dbError.message });
            }
        }
    } catch (e) {
        console.error("Update profile error:", e);
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
userController.updateProfile2 = async (req, res) => {
    try {
        var {id} = req.params;
        await User.findByIdAndUpdate(id, req.body);
        res.json({ success: true, message: "Details Updated SuccessFully" });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to update profile", error: e.message });
    }
}
userController.changePassword = async (req, res) => {
    res.json({ success: true, message: "Change Password endpoint accessed successfully" });
}

userController.updatePassword = async (req, res) => {
    try {
        var {id} = req.user;
        var {password, new_password} = req.body;
        var record = await User.findOne({_id: id, password: password});
        if (record) {
            await User.findByIdAndUpdate(id, {password: new_password});
            res.json({ success: true, message: "Password Updated SuccessFully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid Password", error: "Bad Request" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
userController.addCarRequest=async (req,res)=>
{
    try
    {
        var {id}=req.user;
        const { car } = req.body;
        
        // Check for existing request
        const existingRequest = await PurchaseRequest.findOne({ customer: id, car: car });
        if (existingRequest) {
            return res.status(400).json({ success: false, message: 'You have already sent a purchase request for this vehicle' });
        }

        req.body.customer=id;
        const request = await PurchaseRequest.create(req.body);
        
        // Notify Seller
        try {
            const carDoc = await Car.findById(req.body.car);
            const sellerDoc = await Seller.findById(carDoc.seller);
            const userDoc = await User.findById(id);
            if (sellerDoc && carDoc && userDoc) {
                await emailService.sendPurchaseRequestNotificationToSeller(sellerDoc.email, carDoc, userDoc);
            }
        } catch (emailErr) {
            console.error("Failed to notify seller about purchase request:", emailErr);
        }

        res.json({ success: true, message: 'Purchase Interest Sent to Seller' });
    }
    catch (e)
    {
        res.status(500).json({ success: false, message: "Failed to send request", error: e.message });
    }
}
userController.updateCarStatus=async (req,res)=>
{
    try
    {
        var {id}=req.params;
        var result=await Car.findByIdAndUpdate(id, req.body);
        if(result)
        {
            res.json({ success: true, message: "Car status updated SuccessFully" });
        }
        else
        {
            res.status(404).json({ success: false, message: "Invalid Id", error: "Not Found" });
        }
    }
    catch (e)
    {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
userController.thankyou= (req,res)=>
{
    res.json({ success: true, message: "Thank you for your purchase interest!" });
}
userController.renderMyCarPage= (req,res)=>
{
    res.json({ success: true, message: "My Purchase Requests endpoint accessed successfully" });
}

userController.fetchMyCars = async (req, res) =>
{
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const { id } = req.user;
        const count = await PurchaseRequest.countDocuments({ customer: id });
        const rows = await PurchaseRequest.find({ customer: id })
            .populate({
                path: 'car',
                select: 'brand model name mileage photo price fuelType transmissionType kmDriven ownerType engineCapacity createdAt chassisNumber accidentalHistory category'
            })
            .populate({
                path: 'seller',
                select: 'name email mobile photo address city'
            })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit);

        // Fetch review for each car if it exists
        const rowsWithReviews = await Promise.all(rows.map(async (row) => {
            if (!row.car) return row;
            const review = await Review.findOne({ user: id, car: row.car._id });
            return {
                ...row.toObject(),
                existingReview: review
            };
        }));

        res.json({ 
            success: true, 
            data: rowsWithReviews, 
            meta: {
                total: count,
                page: page,
                limit: limit,
                totalPages: Math.ceil(count / limit)
            },
            message: "My purchase requests fetched successfully" 
        });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch requests", error: e.message });
    }
}

userController.addReview = async (req, res) => {
    try {
        const { carId: car, rating, feedback } = req.body;
        const user = req.user.id;

        if (!car || !rating || !feedback) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Use findOne + update/create to handle editing existing review
        let review = await Review.findOne({ user, car });
        let isNew = false;

        if (review) {
            review.rating = parseInt(rating);
            review.feedback = feedback;
            await review.save();
        } else {
            review = await Review.create({
                user,
                car,
                rating: parseInt(rating),
                feedback
            });
            isNew = true;
        }

        // Send email to seller
        try {
            const carDoc = await Car.findById(car);
            const userDoc = await User.findById(user);
            const sellerDoc = await Seller.findById(carDoc.seller);
            if (sellerDoc && carDoc && userDoc) {
                await emailService.sendReviewNotificationToSeller(sellerDoc.email, carDoc, userDoc, review);
            }
        } catch (emailErr) {
            console.error("Failed to send review email to seller:", emailErr);
        }

        res.json({ 
            success: true, 
            message: isNew ? "Review submitted successfully! Seller notified." : "Review updated successfully!", 
            data: review 
        });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to process review", error: e.message });
    }
}

userController.checkCarRequest = async (req, res) => {
    try {
        const { carId } = req.params;
        const userId = req.user.id;
        const existingRequest = await PurchaseRequest.findOne({ customer: userId, car: carId });
        res.json({ success: true, requested: !!existingRequest });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to check request status", error: e.message });
    }
}

module.exports = userController;