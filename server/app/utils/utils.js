const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const config = require('../core/configs');
const logger = require('../core/logger');
const slugify = require("slugify");

const { secret, tokenLife } = config.jwt;

const createJWTAccessToken = (payload) => {
    const token = jwt.sign(payload, secret, { expiresIn: tokenLife });
    return token
}

const decodeDataFromJWTToken = (token) => {
    try {
        const decoded = jwt.verify(token, secret)
        return decoded
    } catch (err) {
        logger.info(err)
        return null
    }
}

const skuGenerator = (name)=>{
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const length = 8
    let result = `PED_${slugify('prod','_')}_`;
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

const validateMongoDbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  return isValid
};

module.exports = { createJWTAccessToken, decodeDataFromJWTToken, skuGenerator, validateMongoDbId }