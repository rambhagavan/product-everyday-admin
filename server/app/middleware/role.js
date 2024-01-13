const { errorResponse } = require('../core/response');

const checkRole =
  (...roles) =>
    async (req, res, next) => {
      try {
        const user = req.auth
        const hasRole = roles.find(role => user.role === role)
        if (!hasRole) {
          return res.status(403).send(errorResponse(403, 'You are not allowed to make this request.'));
        }
      }
      catch (err) {
        console.log(err)
        return res.status(401).send(errorResponse(401, 'Auth Token Not Valid'));
      }
      next();
    };

const checkAuthor = (...roles) =>
  async (req, res, next) => {
    try {
      const user = req.user
      const hasRole = roles.find(role => user.role === role)
      if (!hasRole) {
        return res.status(403).send(errorResponse(403, 'You are not allowed to make this request.'));
      }
    }
    catch (err) {
      console.log(err)
      return res.status(401).send(errorResponse(401, 'Auth Token Not Valid'));
    }
    next();
  };


module.exports = { checkRole, checkAuthor }