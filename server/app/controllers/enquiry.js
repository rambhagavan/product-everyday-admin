const extend = require('lodash/extend');
const Enquiry = require('../models/enquiry');
const { successResponse, errorResponse } = require('../core/response');
const logger = require('../core/logger');

const create = async (req, res) => {
    try {
        const newEnquiry = await Enquiry.create(req.body);
        return res.status(200).send(
            successResponse(200, newEnquiry, `Ticket Created has been added successfully!`)
        )

    }
    catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}


const read = async (req, res) => {
    try {
        const id = req.params.id;
        const enquiry = await Enquiry.findById(id);
        if (!enquiry) {
            return res.status(404).send(
                errorResponse(404, null, 'No Enquiry found.')
            )
        }
        res.status(200).send(
            successResponse(200, enquiry, "Fetched Enquiry Data Successfully")
        )
    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

const list = async (req, res) => {
    try {
        const enquiries = await Enquiry.find({});
        res.status(200).send(
            successResponse(200, enquiries, null)
        )
    } catch (err) {
        logger.fatal(err)
        res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

const update = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        res.status(200).send(
            successResponse(200, updatedEnquiry, 'Enquiry has been updated successfully!')
        )

    }
    catch (err) {
        logger.fatal(err)
        res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

const remove = async (req, res) => {
    try {
        // const enquiry = await Enquiry.deleteOne({ _id: req.params.id });
        const deletedEnquiry = await Enquiry.findByIdAndDelete(req.params.id );
        if(!deletedEnquiry){
            return res.status(404).send(
                errorResponse(404, null, 'Enquiry Not found!')
            )
        }
        return res.status(200).send(
            successResponse(200, deletedEnquiry, 'enquiry has been deleted successfully!')
        )

    }
    catch (err) {
        logger.fatal(err)
        res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

module.exports = {
    create,
    read,
    list,
    remove,
    update
}
