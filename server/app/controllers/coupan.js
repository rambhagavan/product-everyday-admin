const Coupon = require("../models/coupan");
const { successResponse, errorResponse } = require('../core/response');
const logger = require('../core/logger');

const create = async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.status(200).send(
            successResponse(200, newCoupon, null)
        )
    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
};
const list = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).send(
            successResponse(200, coupons, null)
        )
    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
};
const update = async (req, res) => {
    const _id = req.params.id;
    try {
        const updatecoupon = await Coupon.findByIdAndUpdate(_id, req.body, {
            new: true,
        });
        res.status(200).send(
            successResponse(200, updatecoupon, null)
        )
    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
};
const remove = async (req, res) => {
    const { _id } = req.params.id;
    try {
        const deletecoupon = await Coupon.findByIdAndDelete(_id);
        res.status(200).send(
            successResponse(200, deletecoupon, null)
        )
    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
};
const read = async (req, res) => {
    const _id = req.params.id;
    try {
        const getAcoupon = await Coupon.findById(_id);
        res.status(200).send(
            successResponse(200, getAcoupon, null)
        )
    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
};
module.exports = {
    create,
    list,
    update,
    remove,
    read,
};
