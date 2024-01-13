const express = require('express');
const router = express.Router();

// Bring in Models & Utils
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../constants');
const razorpayController = require('../../controllers/razorpay');

router.post('/customer/create', (req, res) => {
    razorpayController.createCustomer(req, res);
});

// fetch store categories api
router.get('/customer/list', async (req, res) => {
    razorpayController.list(req, res);
});

// fetch categories api
router.get('/customer/:id', async (req, res) => {
    razorpayController.getCustomer(req, res);
});

router.post('/order/create', (req, res) => {
    razorpayController.createOrder(req, res);
});

// fetch categories api
router.get('/order/list', async (req, res) => {
    razorpayController.listOrders(req, res);
});

// fetch categories api
router.get('/order/:id', async (req, res) => {
    razorpayController.getOrder(req, res);
});

router.get('/order/payment/:id', async (req, res) => {
    razorpayController.getPaymentForOrderFromRazorpay(req, res);
});

module.exports = router;
