const extend = require('lodash/extend');
const { successResponse, errorResponse } = require('../core/response');
const logger = require('../core/logger');
const config = require('../core/configs');

// const Razorpay = require('razorpay');
// var razorpayClient = new Razorpay({ key_id: config.razorpay.accessKeyId, key_secret: config.razorpay.secretAccessKey })

const createCustomer = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const gstin = req.body.gstin;


        if (!email || !name || !phone) {
            return res.status(400).send(
                errorResponse(400, null, 'You must enter email & name & phone .')
            )
        }

        const user = await razorpayClient.customers.create({
                name: name,
                contact: phone,
                email: email,
                fail_existing: 0,
                notes: {
                  notes_key_1: "Tea, Earl Grey, Hot",
                  notes_key_2: "Tea, Earl Grey… decaf."
                }
            }
        ).catch((error)=>{
            logger.fatal(JSON.stringify(error))
            throw new Error("Invalid Data")
        })

        return res.status(200).send(
            successResponse(200, user, `Razorpay Customer has been added successfully!`)
        );

    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

const list = async (req, res) => {
    try {
        let customers = await razorpayClient.customers.all()
        res.status(200).send(
            successResponse(200, customers, `Customers data has been fetched successfully!`)
        );

    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

const getCustomer = async (req, res) => {
    try {
        let customerId = req.params.id

        let customer = await razorpayClient.customers.fetch(customerId)
        return res.status(200).send(
            successResponse(200, customer, `Customer data has been fetched successfully!`)
        );

    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

const createOrder = async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        const order = await razorpayClient.orders.create(
            data
        ).catch((error)=>{
            logger.fatal(JSON.stringify(error))
            throw new Error("Invalid Data")
        })

        return res.status(200).send(
            successResponse(200, order, `Razorpay Order has been created successfully!`)
        );

    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}


const listOrders = async (req, res) => {
    try {
        let orders = await razorpayClient.orders.all()
        res.status(200).send(
            successResponse(200, orders, `Orders data has been fetched successfully!`)
        );

    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

const getOrder = async (req, res) => {
    try {
        let orderId = req.params.id

        let order = await razorpayClient.orders.fetch(orderId)
        return res.status(200).send(
            successResponse(200, order, `Order data has been fetched successfully!`)
        );

    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}
const getPaymentForOrderFromRazorpay = async (req, res) => {
    try {
        let orderId = req.params.id

        let order = await razorpayClient.orders.fetchPayments(orderId)
        return res.status(200).send(
            successResponse(200, order, `Payment data for order ${orderId} has been fetched successfully!`)
        );

    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}



module.exports = {
    createCustomer,
    list,
    getCustomer,
    createOrder,
    listOrders,
    getOrder,
    getPaymentForOrderFromRazorpay
}