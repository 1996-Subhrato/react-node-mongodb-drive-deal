var express = require('express');
var router = express.Router();
router.use(express.json());
//post method wala object get krne ke liye
router.use(express.urlencoded({extended: true}));


var indexcontroller = require('../controllers/indexController');

router.get('/',indexcontroller.RenderIndexPage);
router.get('/ping', (req, res) => res.json({ success: true, message: 'pong' }));
//cars
router.get('/cars',indexcontroller.renderCarpage);
router.get('/fetchCategories',indexcontroller.fetchCategories);
router.get('/fetchcars/:id',indexcontroller.fetchCars);


//single car page
router.get('/single_car/:id',indexcontroller.renderSingleCar);
router.get('/fetchSingleCar/:id',indexcontroller.fetchSingleCar);

//compare cars
router.get('/compareCar',indexcontroller.renderCompareCar);
//about and contact
router.get('/about',indexcontroller.renderAboutPage);
router.get('/contact',indexcontroller.renderContactPage);
router.get('/fetchreviews',indexcontroller.fetchReviews);
module.exports = router;