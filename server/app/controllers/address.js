const extend = require('lodash/extend');
const Address = require('../models/address');
const { successResponse, errorResponse } = require('../core/response');
const logger = require('../core/logger');

const create = async (req, res) => {
  try {
    const user = req.auth;

    const address = new Address({
      ...req.body,
      user: user._id
    });
    const addressDoc = await address.save();

    res.status(200).send(
      successResponse(200, addressDoc, `Address has been added successfully!`)
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
    const addressId = req.params.id;

    const addressDoc = await Address.findOne({ _id: addressId });

    if (!addressDoc) {
      return res.status(404).send(
        errorResponse(400, null, `Cannot find Address with the id: ${addressId}.`)
      )
    }

    res.status(200).send(
      successResponse(200, addressDoc, null)
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
    const addresses = await Address.find({ user: req.auth.id });

    res.status(200).send(
      successResponse(200, addresses, null)
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
    const addressId = req.params.id;
    const update = req.body;
    const query = { _id: addressId };

    await Address.findOneAndUpdate(query, update, {
      new: true
    });

    res.status(200).send(
      successResponse(200, null, 'Address has been updated successfully!')
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
    const address = await Address.deleteOne({ _id: req.params.id });

    res.status(200).send(
      successResponse(200, address, 'Address has been deleted successfully!')
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
