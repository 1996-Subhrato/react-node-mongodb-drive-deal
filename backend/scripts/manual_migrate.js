const mongoose = require('mongoose');
const connectDB = require('../mongodb.config'); 

const MongoAdmin = require('../mongo_models/admin');
const MongoUser = require('../mongo_models/user');
const MongoSeller = require('../mongo_models/seller');
const MongoCategory = require('../mongo_models/category');
const MongoCar = require('../mongo_models/car');
const MongoCarRequest = require('../mongo_models/purchase_request');
const MongoReview = require('../mongo_models/review');

const migrate = async () => {
    try {
        await connectDB();
        
        await MongoAdmin.deleteMany({});
        await MongoUser.deleteMany({});
        await MongoSeller.deleteMany({});
        await MongoCategory.deleteMany({});
        await MongoCar.deleteMany({});
        await MongoCarRequest.deleteMany({});
        await MongoReview.deleteMany({});

        const catMap = {};
        const catData = [
            { id: 1, name: 'Sedan', photo: '/categoryPic/sedan.jpg' },
            { id: 3, name: 'Hatchback', photo: '/categoryPic/hatchback.jpg' },
            { id: 4, name: 'sports ', photo: '/categoryPic/sports.jpg' },
            { id: 5, name: 'SUV', photo: '/categoryPic/suv.jpg' }
        ];
        for (const cat of catData) {
            const newCat = await MongoCategory.create({ name: cat.name, photo: cat.photo });
            catMap[cat.id] = newCat._id;
        }

        await MongoAdmin.create({ name: 'Sourav Mourya', email: 'souravmourya203@gmail.com', password: '123' });

        const sellerMap = {};
        const sellerData = [
            { id: 2, name: 'Rohit Kumar', email: 'souravmourya203@gmail.com', password: '123', adhar_card: '435234542333243', pan_card: 'PDWDWDWW344', mobile: '07009057835', gender: 'male', photo: '/dealersPic/driver3.jpg', address: 'L-7/2842 muraby wali gali', city: 'Amritsar', status: 'Active' }
        ];
        for (const seller of sellerData) {
            const newSeller = await MongoSeller.create(seller);
            sellerMap[seller.id] = newSeller._id;
        }

        const userMap = {};
        const userData = [
            { id: 1, first_name: 'Sourav', last_name: 'Mourya', email: 'souravmourya203@gmail.com', password: '123', mobile: '07009057835', gender: 'male', photo: '/usersPic/driver3.jpg', address: 'L-7/2842 muraby wali gali', city: 'Amritsar', status: 'Active' }
        ];
        for (const user of userData) {
            const newUser = await MongoUser.create(user);
            userMap[user.id] = newUser._id;
        }

        const carMap = {};
        const carData = [
            { id: 3, brand: 'skoda', model: '2022', name: 'rapid', fuelType: 'Petrol', transmissionType: 'Manual', mileage: 10.5, kmDriven: 12000, engineCapacity: 1200, chassisNumber: 'VDFDFV12F', price: 350000, ownerType: 'First Owner', accidentalHistory: 'No', address: 'L-7/2842 muraby wali gali', contact: 'souravmourya203@gmail.com', email: 'souravmourya203@gmail.com', photo: '/uploads/skoda.jpg', dealerId: 2, categoryId: 1, status: 'Available' },
            { id: 4, brand: 'Maruti Suzuki ', model: '2023', name: 'Dezire', fuelType: 'Petrol', transmissionType: 'Manual', mileage: 15.5, kmDriven: 12000, engineCapacity: 12000, chassisNumber: 'GJTI123VD', price: 180000, ownerType: 'First Owner', accidentalHistory: 'No', address: 'L-7/2842 muraby wali gali', contact: '8198850602', email: 'souravmourya203@gmail.com', photo: '/uploads/dezire.jpg', dealerId: 2, categoryId: 5, status: 'sold' },
            { id: 5, brand: 'Hyundai', model: '2023', name: 'i20', fuelType: 'Petrol', transmissionType: 'Manual', mileage: 12.5, kmDriven: 10000, engineCapacity: 1200, chassisNumber: 'BVNEFEN123V', price: 150000, ownerType: 'First Owner', accidentalHistory: 'No', address: 'L-7/2842 muraby wali gali', contact: '8198850602', email: 'souravmourya203@gmail.com', photo: '/uploads/i20.jpg', dealerId: 2, categoryId: 1, status: 'sold' },
            { id: 6, brand: 'Toyota', model: '2022', name: 'Innova', fuelType: 'Petrol', transmissionType: 'Manual', mileage: 11.7, kmDriven: 25000, engineCapacity: 1600, chassisNumber: 'EDDF123SDFV', price: 760000, ownerType: 'First Owner', accidentalHistory: 'No', address: 'L-7/2842 muraby wali gali', contact: '8198850602', email: 'souravmourya203@gmail.com', photo: '/uploads/innova.jpg', dealerId: 2, categoryId: 5, status: 'Available' }
        ];
        for (const car of carData) {
            let status = car.status;
            if(status === 'sold') status = 'Sold'; // Fix casing for enum
            const newCar = await MongoCar.create({
                brand: car.brand, model: car.model, name: car.name, fuelType: car.fuelType, transmissionType: car.transmissionType, mileage: car.mileage, kmDriven: car.kmDriven, engineCapacity: car.engineCapacity, chassisNumber: car.chassisNumber, price: car.price, ownerType: car.ownerType, accidentalHistory: car.accidentalHistory, address: car.address, contact: car.contact, email: car.email, photo: car.photo,
                seller: sellerMap[car.dealerId], category: catMap[car.categoryId], status: status
            });
            carMap[car.id] = newCar._id;
        }

        const reqData = [
            { id: 5, carId: 3, dealerId: 2, userId: 1, status: 'Completed' },
            { id: 6, carId: 5, dealerId: 2, userId: 1, status: 'Completed' },
            { id: 7, carId: 4, dealerId: 2, userId: 1, status: 'Completed' },
            { id: 8, carId: 6, dealerId: 2, userId: 1, status: 'Cancelled' }
        ];
        for (const req of reqData) {
            await MongoCarRequest.create({ car: carMap[req.carId], seller: sellerMap[req.dealerId], customer: userMap[req.userId], status: req.status });
        }

        const reviewData = [
            { id: 1, userId: 1, carId: 3, rating: 1, feedback: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.' },
            { id: 2, userId: 1, carId: 3, rating: 5, feedback: 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.' },
            { id: 3, userId: 1, carId: 3, rating: 4, feedback: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born' }
        ];
        for (const rev of reviewData) {
            await MongoReview.create({ user: userMap[rev.userId], car: carMap[rev.carId], rating: rev.rating, feedback: rev.feedback });
        }

        console.log('Migration Completed successfully!');
        process.exit(0);
    } catch (e) {
        console.error('Migration failed:', e);
        process.exit(1);
    }
};

migrate();
