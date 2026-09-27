var indexController = {};
const jwt = require("jsonwebtoken");

var nodemailer = require('nodemailer');

const Category = require('../mongo_models/category');
const Car = require('../mongo_models/car');
const Seller = require('../mongo_models/seller');
const Review = require('../mongo_models/review');
const User = require('../mongo_models/user');

indexController.RenderIndexPage=(req,res)=>
{
    res.json({ success: true, message: "Welcome to Drive Deal API" });
}
indexController.renderCarpage=(req,res)=>
{
    res.json({ success: true, message: "Cars page endpoint accessed successfully" });
}
indexController.fetchCategories=async (req,res)=>
{
    try
    {
        var records=await Category.find();
        res.json({ 
            success: true, 
            data: records, 
            meta: { total: records.length },
            message: "Categories fetched successfully" 
        });
    }
    catch (e)
    {
        res.status(500).json({ success: false, message: "Failed to fetch categories", error: e.message });
    }
}
indexController.fetchCars=async (req,res)=>
{
    try
    {
        let { id } = req.params;
        let { page = 1, limit = 10, brand, minPrice, maxPrice, fuelType, transmissionType, sortBy = 'createdAt', order = 'DESC' } = req.query;
        
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        var whereClause = { status: 'Available' };
        if (id !== 'all') {
            whereClause.category = id;
        }
        if (brand) whereClause.brand = brand;
        if (fuelType) whereClause.fuelType = fuelType;
        if (transmissionType) whereClause.transmissionType = transmissionType;
        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice) whereClause.price.$gte = parseFloat(minPrice);
            if (maxPrice) whereClause.price.$lte = parseFloat(maxPrice);
        }

        const count = await Car.countDocuments(whereClause);
        const rows = await Car.find(whereClause)
            .populate({
                path: 'category',
                select: 'name'
            })
            .sort({ [sortBy]: order === 'DESC' ? -1 : 1 })
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
            message: "Cars fetched successfully" 
        });
    }
    catch (e)
    {
        res.status(500).json({ success: false, message: "Failed to fetch cars", error: e.message });
    }
}
indexController.renderSingleCar=async (req,res)=>
{
    res.json({ success: true, data: { id: req.params.id }, message: "Single car page endpoint accessed successfully" });
}
indexController.fetchSingleCar=async (req,res)=>
{
    try
    {
        var {id}=req.params;
        var record=await Car.findById(id)
            .populate({
                path: 'seller',
                select: 'name email adhar_card pan_card mobile gender photo address city'
            })
            .populate({
                path: 'category',
                select: 'name'
            });
        
        if (record) {
            res.json({ success: true, data: record, message: "Car details fetched successfully" });
        } else {
            res.status(404).json({ success: false, message: "Car not found", error: "Not Found" });
        }
    }
    catch (e)
    {
        res.status(500).json({ success: false, message: "Internal Server Error", error: e.message });
    }
}
indexController.renderCompareCar= (req,res)=>
{
    res.json({ success: true, message: "Compare cars endpoint accessed successfully" });
}
indexController.renderAboutPage= (req,res)=>
{
    res.json({ success: true, message: "About page endpoint accessed successfully" });
}
indexController.renderContactPage= (req,res)=>
{
    res.json({ success: true, message: "Contact page endpoint accessed successfully" });
}
indexController.fetchReviews=async (req,res)=>
{
    try
    {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const count = await Review.countDocuments();
        const rows = await Review.find()
            .populate({
                path: 'user',
                select: 'first_name last_name photo'
            })
            .populate({
                path: 'car',
                select: 'name photo model'
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
            message: "Reviews fetched successfully" 
        });
    }
    catch (e)
    {
        res.status(500).json({ success: false, message: "Failed to fetch reviews", error: e.message });
    }
}
module.exports = indexController;