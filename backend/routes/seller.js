var express = require('express');
var sellerRouter = express.Router();
sellerRouter.use(express.json());
sellerRouter.use(express.urlencoded({extended: true}));

var cookieParser = require('cookie-parser');
sellerRouter.use(cookieParser());

var sellerController = require('../controllers/sellerController');
const jwt = require("jsonwebtoken");
var secret_key = 'abcd#$%@12345678';
const { body } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');


function AuthorizeSeller(req, res, next) {
    var token = req.cookies.SellerToken;
    if (!token)
    {
        res.status(401).json({ success: false, message: 'Login Required', error: 'Unauthorized' });
    } else {
        try
        {
            req.seller = jwt.verify(token, secret_key);
            next();
        } catch (e) {
            res.status(401).json({ success: false, message: 'Invalid Token', error: 'Unauthorized' });
        }
    }
}

function AuthorizeSeller_HTTP(req, res, next) {
    var token = req.cookies.SellerToken;

    if (!token)
    {
        res.status(401).json({ success: false, message: 'Login Required', error: 'Unauthorized' });
    } else {
        try
        {
            req.seller = jwt.verify(token, secret_key);
            next();
        } catch (e) {
            res.status(401).json({ success: false, message: 'Unauthorized Access', error: 'Unauthorized' });
        }
    }
}


sellerRouter.get('/signup', sellerController.RenderSignup);
sellerRouter.get('/login', sellerController.RenderLogin);
sellerRouter.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate
], sellerController.registerSeller);
sellerRouter.post('/login', [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], sellerController.loginSeller);
sellerRouter.get('/dashboard', AuthorizeSeller, sellerController.renderDashBoard);
sellerRouter.get('/stats', AuthorizeSeller_HTTP, sellerController.getStats);
sellerRouter.get('/token', AuthorizeSeller_HTTP, sellerController.checkToken);

sellerRouter.get('/logout', AuthorizeSeller_HTTP, sellerController.logoutUser);
sellerRouter.get('/profile', AuthorizeSeller, sellerController.renderProfile);
sellerRouter.get('/showProfile', AuthorizeSeller_HTTP, sellerController.showProfile);
sellerRouter.post('/updateProfile', AuthorizeSeller_HTTP, sellerController.updateProfile);
sellerRouter.put('/updateProfile/:id', AuthorizeSeller_HTTP, sellerController.updateProfile);
sellerRouter.put('/update_profile/:id', AuthorizeSeller_HTTP, sellerController.updateProfile2);
sellerRouter.get('/changePassword', AuthorizeSeller, sellerController.changePassword);
sellerRouter.put('/changePassword', AuthorizeSeller_HTTP, sellerController.updatePassword);

// Cars
sellerRouter.get('/manage_car', AuthorizeSeller, sellerController.renderManageCar);
sellerRouter.post('/addcar', [
    AuthorizeSeller_HTTP,
    body('name').notEmpty().withMessage('Car name is required'),
    body('brand').notEmpty().withMessage('Brand is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    validate
], sellerController.addCar);
sellerRouter.get('/fetchcategories', AuthorizeSeller_HTTP, sellerController.fetchCategories);
sellerRouter.get('/fetchcars', AuthorizeSeller_HTTP, sellerController.fetchcars);
sellerRouter.put('/updatecar/:id', AuthorizeSeller_HTTP, sellerController.updateCar);
sellerRouter.delete('/deletecar/:id', AuthorizeSeller_HTTP, sellerController.deleteCar);

// Purchase Requests
sellerRouter.get('/car_req', AuthorizeSeller, sellerController.renderManageCarReq);
sellerRouter.get('/fetchcarswithrequests', AuthorizeSeller_HTTP, sellerController.fetchCarsWithRequests);
sellerRouter.get('/fetchcarreq', AuthorizeSeller_HTTP, sellerController.fetchCarReq);
sellerRouter.put('/updatereq/:id', AuthorizeSeller_HTTP, sellerController.UpdateCarReq);
sellerRouter.put('/updateCar/:id', AuthorizeSeller_HTTP, sellerController.updateCarStatus);

// Sold Cars
sellerRouter.get('/view_approved_req', AuthorizeSeller, sellerController.renderApprovedReq);
sellerRouter.get('/fetchapprovedbooking', AuthorizeSeller_HTTP, sellerController.fetchApprovedReq);

// Send Email
sellerRouter.post('/send-email', AuthorizeSeller_HTTP, sellerController.sendEmail);

module.exports = sellerRouter;