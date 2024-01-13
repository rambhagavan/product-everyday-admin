const jwt = require('jsonwebtoken');

const keys = require('../core/configs');
const User = require('../models/user');
const { errorResponse } = require('../core/response');
const { secret, tokenLife } = keys.jwt;

const checkAuth = () => async (req, res, next) => {
  try {
    if (!req.headers.bearer) {
      return res.status(401).send(errorResponse(401, 'Auth Token Not Provided'));
    }
    const userJWT = jwt.verify(req.headers.bearer, secret)
    const user = await User.findById(userJWT.id)
    req.auth = user
    next()
  } catch (err) {
    return res.status(401).send(errorResponse(401, 'Auth Token Not Valid'));
  }
}

module.exports = checkAuth