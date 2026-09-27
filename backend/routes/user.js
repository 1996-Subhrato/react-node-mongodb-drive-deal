var express = require('express');
var userrouter = express.Router();
var cookieParser = require('cookie-parser');
userrouter.use(cookieParser());
//json get krne ke liye
userrouter.use(express.urlencoded({extended: true}));
userrouter.use(express.json());
var jwt = require('jsonwebtoken');
var secret_key = 'abcd#$%@12345678';
var userController = require('../controllers/userController');
const indexcontroller = require("../controllers/indexController");
const adminController = require("../controllers/adminController");
const { body } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

function AuthorizeUser(req, res, next) {
    var token = req.cookies.UserToken;
    if (!token)
    {
        res.status(401).json({ success: false, message: 'Login Required', error: 'Unauthorized' });
    } else {
        try
        {
            req.user = jwt.verify(token, secret_key);
            next();
        } catch (e) {
            res.status(401).json({ success: false, message: 'Invalid Token', error: 'Unauthorized' });
        }
    }
}

//json value k liye middleware
function AuthorizeUser_HTTP(req, res, next) {
    var token = req.cookies.UserToken;

    if (!token)
    {
        res.status(401).json({ success: false, message: 'Login Required', error: 'Unauthorized' });
    } else {
        try
        {
            req.user = jwt.verify(token, secret_key);
            next();
        } catch (e) {
            res.status(401).json({ success: false, message: 'Unauthorized Access', error: 'Unauthorized' });
        }
    }
}
userrouter.get('/signup',userController.renderSignUpPage);
userrouter.get('/login',userController.renderLoginPage);
userrouter.post('/register', [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate
], userController.registerUser);
userrouter.post('/login', [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], userController.loginUser);
//dashboard
userrouter.get('/dashboard',AuthorizeUser,userController.renderDashboard);

//check token
userrouter.get('/token', AuthorizeUser_HTTP, userController.checkToken);
userrouter.get('/stats', AuthorizeUser_HTTP, userController.getStats);

//logout
userrouter.get('/logout', AuthorizeUser_HTTP, userController.logoutUser);
//render profile page
userrouter.get('/profile', AuthorizeUser, userController.renderProfile);
userrouter.get('/showProfile', AuthorizeUser_HTTP, userController.showProfile);
userrouter.put('/updateProfile/:id', AuthorizeUser_HTTP, userController.updateProfile);
userrouter.put('/update_profile/:id', AuthorizeUser_HTTP, userController.updateProfile2);

//render change password
userrouter.get('/changePassword', AuthorizeUser, userController.changePassword);
userrouter.put('/changePassword', AuthorizeUser_HTTP, userController.updatePassword);

//purchase requests
userrouter.post('/addPurchaseRequest', AuthorizeUser_HTTP, userController.addCarRequest);
userrouter.put('/updateCar/:id', AuthorizeUser_HTTP, userController.updateCarStatus);
//thankyou
userrouter.get('/thankyou', AuthorizeUser_HTTP, userController.thankyou);
//my purchase interests
userrouter.get('/mypurchase_requests', AuthorizeUser, userController.renderMyCarPage);
userrouter.get('/fetchMyPurchaseRequests', AuthorizeUser_HTTP, userController.fetchMyCars);
userrouter.get('/check_request/:carId', AuthorizeUser_HTTP, userController.checkCarRequest);
//review
userrouter.post('/addreview', AuthorizeUser_HTTP, userController.addReview);

module.exports = userrouter;