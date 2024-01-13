const mongoose = require("mongoose");
const { errorResponse } = require('../core/response');

const checkValidMongoDbId = () => async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(401).send(errorResponse(401, 'Not a Valid Mongodb object id'));
    }
    next()
  } catch (err) {
    return res.status(500).send(errorResponse(500, 'Internal Server Error'));
  }
}

module.exports = {
    checkValidMongoDbId
}