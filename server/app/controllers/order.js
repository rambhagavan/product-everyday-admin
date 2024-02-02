const Order = require('../models/order.js');
const logger = require('../core/logger');
const { successResponse, errorResponse } = require('../core/response');

//create new order
const create = async (req, res, next) => {
    const {  user,
             orderItems,
             totalItems,
             totalCartPrice, 
             deliveryAddressInfo,  
             deliveryCharge, 
             totalPrice } = req.body;
    try {
        const order = new Order({
            user,
            orderItems,
            orderItems,
            totalItems,
            totalCartPrice,
            deliveryAddressInfo,
            paymentIntent: [{
                id: "",
                status: "payment awaiting"
            }],
            deliveryCharge,
            totalPrice,
            orderStatus: "Processing"
        });
        await order.save();
        return res.status(201).send(
            successResponse(201, order, "Successfully Created up!")
        )
    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message)
        )
    }
}

//fetch order by id
const read = async (req, res, next) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(400).json({ error: 'Missing orderId  parameter' });
        }
        
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).send(
                errorResponse(404, null, 'Order not found.')
            )
        }

        return res.status(200).send(
            successResponse(200, order, null)
        )
    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

//fetch user orders(myorders)
const readUserOrders = async (req, res, next) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({ error: 'Missing userId  parameter' });
        }

        const orders = await Order.find({ "user.userId": userId});

        if (!orders) {
            return res.status(404).send(
                errorResponse(404, typeof(userId), 'Orders not jkjfound.')
            )
        }

        return res.status(200).send(
            successResponse(200, orders, null)
        )
    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

//list all orders --admin
const list = async (req, res, next) => {
    try {
        let {
            sortOrder,
            page = 1,
            limit = 10
        } = req.query;
        sortOrder = JSON.parse(sortOrder);

        let orders = null;
        const ordersCount = (await Order.find({})).length;
        if (sortOrder) {
            orders = await Order.find({})
                .sort([
                    [sortOrder[0], sortOrder[1]]
                ])
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
        } else {
            orders = await Order.find({})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
        }

        if (!orders) {
            return res.status(404).send(
                errorResponse(404, null, 'Orders not found.')
            )
        }

        return res.status(200).send(
            successResponse(200, {
                orders,
                totalPages: Math.ceil(ordersCount / limit),
                currentPage: page
            }, null)
        )
    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

//update order status
const update = async (req, res, next) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(400).json({ error: 'Missing orderId  parameter' });
        }
        
        let order = await Order.findById(orderId);
        let newOrderStatus = req.query.orderStatus;
        if (!order) {
            return res.status(404).send(
                errorResponse(404, null, 'Order not found.')
            )
        }
        
        order.orderStatus = newOrderStatus;
        await order.save();

        return res.status(200).send(
            successResponse(200, order, null)
        )
    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

//delete order
const deleteOrder = async(req,res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(400).json({ error: 'Missing orderId  parameter' });
        }
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).send(
                errorResponse(404, null, 'Order not found.')
            )
        }
        
        await Order.deleteOne({ _id: orderId });

        return res.status(200).send(
            successResponse(200, null, 'Order has been deleted successfully!')
        )
    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

module.exports = {
    create,
    read,
    readUserOrders,
    list,
    update,
    deleteOrder
}