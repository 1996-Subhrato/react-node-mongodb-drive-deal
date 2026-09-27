const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const emailService = require('../utils/emailService');
const sellerController = {};
var secret_key = 'abcd#$%@12345678';

var nodemailer = require('nodemailer');

const Seller = require('../mongo_models/seller');
const Car = require('../mongo_models/car');
const Category = require('../mongo_models/category');
const PurchaseRequest = require('../mongo_models/purchase_request');
const User = require('../mongo_models/user');
const Review = require('../mongo_models/review');

sellerController.RenderSignup = (req, res) => {
    res.json({ success: true, message: "Seller signup endpoint reached. Please POST details to /register." });
}
sellerController.RenderLogin = (req, res) => {
    res.json({ success: true, message: "Seller login endpoint reached. Please POST credentials to /login." });
}
sellerController.registerSeller = async (req, res) => {
    try {
        if (req.body.aadhaar_card && !req.body.adhar_card) {
            req.body.adhar_card = req.body.aadhaar_card;
        }

        var { email } = req.body;
        const [sellerExists, userExists] = await Promise.all([
            Seller.findOne({ email }),
            User.findOne({ email })
        ]);

        if (!sellerExists && !userExists) {
            if (!req.files || !req.files.photo) {
                return res.status(400).json({ success: false, message: "Profile photo is required" });
            }

            var { photo } = req.files;
            var server_path = `public/sellersPic/${photo.name}`;
            var db_path = `/sellersPic/${photo.name}`;

            photo.mv(server_path, async (error) => {
                if (error) {
                    console.error("Photo upload error:", error);
                    res.status(500).json({ success: false, message: "Failed to upload photo", error: error.message });
                } else {
                    try {
                        req.body.photo = db_path;
                        delete req.body.status;

                        await Seller.create(req.body);


                        res.json({ success: true, message: "Seller registered Successfully" });
                    } catch (e) {
                        console.error("Database error during seller registration:", e);
                        res.status(500).json({ success: false, message: "Failed to register seller", error: e.message });
                    }
                }
            });
        } else {
            const collisionType = sellerExists ? "Seller" : "User";
            res.status(400).json({ success: false, message: `${collisionType} with this email already exists` });
        }
    } catch (e) {
        console.error("Internal Server Error in registerSeller:", e);
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
sellerController.loginSeller = async (req, res) => {
    try {
        var { email, password } = req.body;
        var result = await Seller.findOne({
            email: email,
            password: password
        });
        if (result) {
            if (result.status === 'Active') {
                var payload = {
                    id: result._id,
                    email: result.email,
                    name: result.name,
                    photo: result.photo
                }
                var token = jwt.sign(payload, secret_key, { expiresIn: '1D' });
                res.cookie('SellerToken', token);
                res.json({ success: true, data: { token, seller: payload }, message: "Login Successful" });
            } else {
                res.status(403).json({ success: false, message: "KYC DETAILS ARE UNDER PROCESS", error: "Forbidden" });
            }
        } else {
            res.status(401).json({ success: false, message: "Invalid Credentials", error: "Authentication Failed" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
sellerController.renderDashBoard = (req, res) => {
    res.json({ success: true, message: "Seller Dashboard accessed successfully" });
}
sellerController.getStats = async (req, res) => {
    try {
        const sellerId = req.seller.id;
        
        const [totalCars, pendingCount, soldCount, revenueData] = await Promise.all([
            Car.countDocuments({ seller: sellerId }),
            PurchaseRequest.countDocuments({ seller: sellerId, status: 'Pending' }),
            PurchaseRequest.countDocuments({ seller: sellerId, status: 'Sold' }),
            Car.aggregate([
                { $match: { seller: new mongoose.Types.ObjectId(sellerId), status: 'Sold' } },
                { $group: { _id: null, total: { $sum: "$price" } } }
            ])
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        res.json({
            success: true,
            data: {
                vehicles: totalCars,
                pending: pendingCount,
                sold: soldCount,
                revenue: totalRevenue
            }
        });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch stats", error: e.message });
    }
}
sellerController.checkToken = (req, res) => {
    if (req.seller) {
        res.json({ success: true, message: "Token is valid", data: req.seller });
    } else {
        res.status(401).json({ success: false, message: "Unauthorized", error: "No token found" });
    }
}
sellerController.logoutUser = (req, res) => {
    res.clearCookie('SellerToken');
    res.json({ success: true, message: "Logged out successfully" });
}
sellerController.renderProfile = (req, res) => {
    res.json({ success: true, message: "Seller Profile endpoint accessed successfully" });
}
sellerController.showProfile = async (req, res) => {
    try {
        var { id } = req.seller;
        var record = await Seller.findById(id);
        if (record) {
            res.json({ success: true, data: record, message: "Profile fetched successfully" });
        } else {
            res.status(404).json({ success: false, message: "Seller profile not found", error: "Not Found" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
sellerController.updateProfile = async (req, res) => {
    try {
        let id = req.params.id;
        if (!id || id === 'undefined' || id === 'null') {
            id = req.seller.id;
        }
        
        console.log("Updating profile for seller ID:", id);
        console.log("Update Data:", req.body);

        const updateData = { ...req.body };
        delete updateData.email; 
        delete updateData.password;

        if (req.files) {
            const uploadPromises = [];
            
            if (req.files.photo) {
                const photo = req.files.photo;
                const fileName = `seller_photo_${id}_${Date.now()}.${photo.name.split('.').pop()}`;
                const server_path = `public/sellersPic/${fileName}`;
                const db_path = `/sellersPic/${fileName}`;
                
                uploadPromises.push(new Promise((resolve, reject) => {
                    photo.mv(server_path, (err) => {
                        if (err) reject(err);
                        else {
                            updateData.photo = db_path;
                            resolve();
                        }
                    });
                }));
            }

            if (req.files.banner) {
                const banner = req.files.banner;
                const fileName = `seller_banner_${id}_${Date.now()}.${banner.name.split('.').pop()}`;
                const server_path = `public/sellersPic/${fileName}`;
                const db_path = `/sellersPic/${fileName}`;
                
                uploadPromises.push(new Promise((resolve, reject) => {
                    banner.mv(server_path, (err) => {
                        if (err) reject(err);
                        else {
                            updateData.banner = db_path;
                            resolve();
                        }
                    });
                }));
            }

            try {
                await Promise.all(uploadPromises);
                await Seller.findByIdAndUpdate(id, updateData);
                return res.json({ success: true, message: "Profile updated successfully" });
            } catch (error) {
                console.error("Upload/Update error:", error);
                return res.status(500).json({ success: false, message: "Failed to update profile", error: error.message });
            }
        } else {
            try {
                await Seller.findByIdAndUpdate(id, updateData);
                return res.json({ success: true, message: "Profile updated successfully" });
            } catch (dbError) {
                console.error("DB Update error:", dbError);
                return res.status(500).json({ success: false, message: "Failed to update profile", error: dbError.message });
            }
        }
    } catch (e) {
        console.error("Update profile error:", e);
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
sellerController.updateProfile2 = async (req, res) => {
    try {
        var { id } = req.params;
        await Seller.findByIdAndUpdate(id, req.body);
        res.json({ success: true, message: "Details Updated SuccessFully" });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to update profile", error: e.message });
    }
}
sellerController.changePassword = async (req, res) => {
    res.json({ success: true, message: "Change Password endpoint accessed successfully" });
}

sellerController.updatePassword = async (req, res) => {
    try {
        var { id } = req.seller;
        var { password, new_password } = req.body;
        var record = await Seller.findOne({ _id: id, password: password });
        if (record) {
            await Seller.findByIdAndUpdate(id, { password: new_password });
            res.json({ success: true, message: "Password Updated SuccessFully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid Password", error: "Bad Request" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
sellerController.renderManageCar = async (req, res) => {
    res.json({ success: true, message: "Manage Car endpoint accessed successfully" });
}
sellerController.addCar = async (req, res) => {
    try {
        if (!req.files || !req.files.photo) {
            return res.status(400).json({ success: false, message: "Car photo is required" });
        }

        var { photo } = req.files;
        var { id } = req.seller;
        var server_path = `public/uploads/${photo.name}`;
        var db_path = `/uploads/${photo.name}`;

        photo.mv(server_path, async (error) => {
            if (error) {
                console.error("Photo upload error:", error);
                res.status(500).json({ success: false, message: "Failed to upload photo", error: error.message });
            } else {
                try {
                    const seller = await Seller.findById(id);
                    if (!seller) {
                        return res.status(404).json({ success: false, message: "Seller not found" });
                    }

                    req.body.photo = db_path;
                    req.body.seller = id;
                    if (req.body.categoryId) {
                        req.body.category = req.body.categoryId;
                    }
                    
                    if (!req.body.address) req.body.address = seller.city || seller.address;
                    if (!req.body.location) req.body.location = seller.address || seller.city;
                    if (!req.body.contact) req.body.contact = seller.mobile;

                    await Car.create(req.body);

                    res.json({ success: true, message: "Car Added Successfully" });
                }
                catch (e) {
                    console.error("Database error in addCar:", e);
                    res.status(500).json({ success: false, message: "Failed to add car", error: e.message });
                }
            }
        });
    } catch (e) {
        console.error("Internal Server Error in addCar:", e);
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
sellerController.fetchCategories = async (req, res) => {
    try {
        var records = await Category.find();
        res.json({ success: true, data: records, message: "Categories fetched successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch categories", error: e.message });
    }
}
sellerController.fetchcars = async (req, res) => {
    try {
        let { page = 1, limit = 10, status } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const whereClause = { seller: req.seller.id };
        if (status) whereClause.status = status;

        const count = await Car.countDocuments(whereClause);
        const rows = await Car.find(whereClause)
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit);

        // Check for requests for each car
        const carsWithRequestStatus = await Promise.all(rows.map(async (car) => {
            const hasRequests = await PurchaseRequest.exists({ car: car._id });
            return {
                ...car.toObject(),
                hasRequests: !!hasRequests
            };
        }));

        res.json({
            success: true,
            data: carsWithRequestStatus,
            meta: {
                total: count,
                page: page,
                limit: limit,
                totalPages: Math.ceil(count / limit)
            },
            message: "Cars fetched successfully"
        });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch cars", error: e.message });
    }
}

sellerController.updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const sellerId = req.seller.id;

        // Check if there are any purchase requests for this car
        const requestsExist = await PurchaseRequest.exists({ car: id });
        if (requestsExist) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot edit car details as purchase requests have already been made for this vehicle." 
            });
        }

        if (req.files && req.files.photo) {
            const { photo } = req.files;
            const server_path = `public/uploads/${photo.name}`;
            const db_path = `/uploads/${photo.name}`;

            photo.mv(server_path, async (error) => {
                if (error) {
                    return res.status(500).json({ success: false, message: "Failed to upload photo", error: error.message });
                }
                req.body.photo = db_path;
                await Car.findOneAndUpdate({ _id: id, seller: sellerId }, req.body);
                res.json({ success: true, message: "Car updated successfully" });
            });
        } else {
            await Car.findOneAndUpdate({ _id: id, seller: sellerId }, req.body);
            res.json({ success: true, message: "Car updated successfully" });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to update car", error: e.message });
    }
}
sellerController.deleteCar = async (req, res) => {
    try {
        var { id } = req.params;
        
        // Check if there are any purchase requests for this car
        const requestsExist = await PurchaseRequest.exists({ car: id });
        if (requestsExist) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete car as purchase requests have already been made for this vehicle." 
            });
        }

        await Car.findByIdAndDelete(id);
        res.json({ success: true, message: "Car deleted successfully" });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Failed to delete car", error: e.message });
    }
}
sellerController.renderManageCarReq = async (req, res) => {
    res.json({ success: true, message: "Manage Purchase Requests endpoint accessed successfully" });
}
sellerController.fetchCarReq = async (req, res) => {
    try {
        let { page = 1, limit = 10, status = 'Pending' } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const count = await PurchaseRequest.countDocuments({ seller: req.seller.id, status: status });
        const rows = await PurchaseRequest.find({ seller: req.seller.id, status: status })
            .populate({
                path: 'car',
                select: 'brand model name mileage photo price status fuelType transmissionType kmDriven engineCapacity ownerType chassisNumber accidentalHistory category'
            })
            .populate({
                path: 'customer',
                select: 'first_name last_name email mobile'
            })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit);
        res.json({
            success: true,
            data: rows,
            meta: {
                total: count,
                page: page,
                limit: limit,
                totalPages: Math.ceil(count / limit)
            },
            message: "Purchase requests fetched successfully"
        });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch purchase requests", error: e.message });
    }
}
sellerController.UpdateCarReq = async (req, res) => {
    try {
        var { id } = req.params;
        const { status } = req.body;
        
        const purchaseReq = await PurchaseRequest.findById(id);
        if (!purchaseReq) {
            return res.status(404).json({ success: false, message: "Purchase request not found" });
        }

        await PurchaseRequest.findByIdAndUpdate(id, req.body);

        // Update Car status based on request status
        if (status === 'Approved') {
            await Car.findByIdAndUpdate(purchaseReq.car, { status: 'Approved' });
            
            // Reject all other pending requests for this car when one is approved
            await PurchaseRequest.updateMany(
                { car: purchaseReq.car, _id: { $ne: id }, status: 'Pending' },
                { status: 'Rejected' }
            );
        } else if (status === 'Sold') {
            await Car.findByIdAndUpdate(purchaseReq.car, { status: 'Sold' });
            
            // Reject all other pending/approved requests for this car
            await PurchaseRequest.updateMany(
                { car: purchaseReq.car, _id: { $ne: id }, status: { $in: ['Pending', 'Approved'] } },
                { status: 'Rejected' }
            );

            // Send Confirmation Email
            try {
                const [user, car] = await Promise.all([
                    User.findById(purchaseReq.customer),
                    Car.findById(purchaseReq.car)
                ]);
                if (user && car) {
                    await emailService.sendSaleConfirmationEmail(user.email, car);
                }
            } catch (emailErr) {
                console.error("Failed to send sale confirmation email:", emailErr);
            }
        } else if (status === 'Pending') {
            // This happens when cancelling an approval
            await Car.findByIdAndUpdate(purchaseReq.car, { status: 'Available' });
            
            // Optionally revert rejected requests back to pending so seller can choose someone else
            await PurchaseRequest.updateMany(
                { car: purchaseReq.car, status: 'Rejected' },
                { status: 'Pending' }
            );
        }

        res.json({ success: true, message: `Request updated to ${status} successfully` });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Failed to update request", error: e.message });
    }
}
sellerController.updateCarStatus = async (req, res) => {
    try {
        var { id } = req.params;
        var result = await Car.findByIdAndUpdate(id, req.body);
        if (result) {
            res.json({ success: true, message: "Car status updated SuccessFully" });
        }
        else {
            res.status(404).json({ success: false, message: "Invalid Id", error: "Not Found" });
        }
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
sellerController.renderApprovedReq = (req, res) => {
    res.json({ success: true, message: "Approved Requests endpoint accessed successfully" });
}
sellerController.fetchApprovedReq = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const count = await PurchaseRequest.countDocuments({ seller: req.seller.id, status: 'Sold' });
        const rows = await PurchaseRequest.find({ seller: req.seller.id, status: 'Sold' })
            .populate({
                path: 'car',
                select: 'brand model name mileage photo price status fuelType transmissionType kmDriven engineCapacity ownerType chassisNumber accidentalHistory category'
            })
            .populate({
                path: 'customer',
                select: 'first_name last_name email mobile'
            })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit);
        res.json({
            success: true,
            data: rows,
            meta: {
                total: count,
                page: page,
                limit: limit,
                totalPages: Math.ceil(count / limit)
            },
            message: "Sold cars fetched successfully"
        });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch sold cars", error: e.message });
    }
}

sellerController.sendEmail = async (req, res) => {
    try {
        var { email, vehicle_name, status, name } = req.body;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dummymail2003s@gmail.com',
                pass: 'uevludqlpergxtje',
            },
        });
        const mailOptions = {
            from: 'dummymail2003s@gmail.com',
            to: email,
            subject: `Subject: Your ${vehicle_name} Purchase Interest Has Been ${status}`,
            html: `<h1>Dear ${name}</h1>
<p>This is to inform you that your interest in purchasing ${vehicle_name} at Drive Deal has been ${status}.</p>`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
            } else {
                res.json({ success: true, message: "E-Mail Sent Successfully" });
            }
        });
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
sellerController.fetchCarsWithRequests = async (req, res) => {
    try {
        const sellerId = req.seller.id;
        const { status } = req.query;
        
        // Build filter
        const whereClause = { seller: sellerId };
        if (status === 'Sold') {
            whereClause.status = 'Sold';
        } else {
            // For 'Buy Requests', we show cars that are Available or Approved
            whereClause.status = { $in: ['Available', 'Approved'] };
        }

        // Find matching cars
        const cars = await Car.find(whereClause)
            .populate('category', 'name')
            .sort({ updatedAt: -1 });

        // For each car, find its purchase requests and potential review
        const carsWithRequests = await Promise.all(cars.map(async (car) => {
            const requests = await PurchaseRequest.find({ car: car._id })
                .populate('customer', 'first_name last_name email mobile')
                .sort({ createdAt: -1 });
            
            // If car is sold, find the review
            let review = null;
            if (car.status === 'Sold') {
                review = await Review.findOne({ car: car._id })
                    .populate('user', 'first_name last_name');
            }
            
            return {
                ...car.toObject(),
                purchaseRequests: requests,
                review: review
            };
        }));

        // Filter: only include cars that HAVE requests OR are already Sold/Approved
        const filteredCars = carsWithRequests.filter(c => c.purchaseRequests.length > 0 || c.status === 'Sold' || c.status === 'Approved');

        res.json({ success: true, data: filteredCars });
    } catch (e) {
        res.status(500).json({ success: false, message: "Failed to fetch cars with requests", error: e.message });
    }
}

module.exports = sellerController;