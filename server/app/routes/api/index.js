const router = require('express').Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const addressRoutes = require('./address');
const productRoutes = require('./product');
const categoryRoutes = require('./category');
const razorpayRoutes = require('./razorpay');
const enquiryRoutes = require('./enquiry');
const coupanRoutes = require('./coupan');
const restaurantRoutes = require('./restaurant');
const restaurantItemRoutes = require('./restaurantItem');
const uploadRoutes = require('./upload');
const brandRoutes = require('./brand');

// auth routes
router.use('/auth', authRoutes);

// user routes
router.use('/user', userRoutes);

// address routes
router.use('/address', addressRoutes);

// category routes
router.use('/category', categoryRoutes);

// product routes
router.use('/product', productRoutes);

// brand routes
router.use('/brand', brandRoutes);

// razorpyay routes
router.use('/razorpay', razorpayRoutes);

// enquiry routes
router.use('/enquiry', enquiryRoutes);

// coupan routes
router.use('/coupan', coupanRoutes);

// restaurant routes
router.use('/restaurant', restaurantRoutes);

// restaurant routes
router.use('/restaurantItem', restaurantItemRoutes);

// upload routes
router.use('/upload', uploadRoutes);

module.exports = router;