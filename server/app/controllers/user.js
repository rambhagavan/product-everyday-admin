const extend = require('lodash/extend');
const User = require('../models/user');
const chalk = require('chalk');
const bcrypt = require('bcryptjs');
const { successResponse, errorResponse } = require('../core/response');
const logger = require('../core/logger');

const create = async (req, res) => {
    try {
        let user = new User(req.body)
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        await user.save()
        return res.status(201).send(
            successResponse(201, null, "Successfully Created up!")
        )
    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message)
        )
    }
}


const read = async (req, res) => {
    try {
        let user = req.user
        user.password = undefined
        // All other User Attributes will come here
        res.status(200).send(
            successResponse(200, user, null)
        )
    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

const readActive = async (req, res) => {
    try {
        let user = req.user
        user.password = undefined
        if(!user.isActive){
            return res.status(403).send(
                errorResponse(403, null, 'User Not Active found.')
            )
        }
        res.status(200).send(
            successResponse(200, user, null)
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
        let {
            sortOrder,
            page = 1,
            limit = 10
        } = req.query;
        sortOrder = JSON.parse(sortOrder);

        let users = null;
        const usersCount = (await User.find({}));
        const count = usersCount.length;
        const size = count > limit ? page - 1 : 0;
        const currentPage = count > limit ? Number(page) : 1;
        // paginate query
        const paginateQuery = [
            // { $sort: sortOrder },
            { $skip: size * limit },
            { $limit: limit * 1 },
            {
                $project: {
                    "password": false,
                }
            }
        ];

        users = await User.aggregate(paginateQuery);
        res.status(200).send(
            successResponse(
                200,
                {
                    users,
                    totalPages: Math.ceil(count / limit),
                    currentPage,
                    count
                },
                null)
        )
    } catch (err) {
        logger.fatal(err)
        res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

const listActive = async (req, res) => {
    try {
        const categories = await User.find({ isActive: true });
        res.status(200).send(
            successResponse(200, categories, null)
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
        let user = req.user
        user = extend(user, req.body)
        user.updated = Date.now()
        await user.save()
        user.password = undefined
        res.status(200).send(
          successResponse(200, user, 'User updated successfully!')
        )
    }
    catch (err) {
        logger.fatal(err)
        res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

const search = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 10,
            q = null
        } = req.query;
        let users = null;
        const usersCount = (await User.find({}));
        const count = usersCount.length;
        const size = count > limit ? page - 1 : 0;
        const currentPage = count > limit ? Number(page) : 1;

        users = await User.find({
            $or: [
                { firstName: { $regex: q, $options: 'i' } }, // Case-insensitive name search
                { email: { $regex: q, $options: 'i' } }, // Case-insensitive description search
                { lastName: { $regex: q, $options: 'i' } }, // Case-insensitive description search
            ],
        }).skip(size * limit).limit(limit * 1);

        res.status(200).send(
            successResponse(
                200,
                {
                    users,
                    totalPages: Math.ceil(count / limit),
                    currentPage,
                    count
                },
                null)
        )
    } catch (err) {
        logger.fatal(err)
        res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

const remove = async (req, res) => {
    try {
        let user = req.user
        let deletedUser = await user.deleteOne({ _id: user.id })
        deletedUser.password = undefined
        deletedUser.salt = undefined
        res.status(200).send(
            successResponse(200, deletedUser, 'User deleted successfully!')
        )

    }
    catch (err) {
        logger.fatal(err)
        res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

const bulk = async (req, res) => {
    try {
        const listOfIds = req.body.listOfIds;
        const operation = req.body.operation;
        if (operation !== 'delete' && operation !== 'update') {
            return res.status(400).send(
                errorResponse(400, null, 'Unsupported operation')
            )
        }
        const responseList = []

        if (operation === 'update') {
            const update = req.body.updateData

            for (let id of listOfIds) {
                const query = { _id: id };
                const categoryDoc = await Category.findOne(query)
                if (!categoryDoc) {
                    responseList.push({
                        id: "Not Found"
                    })
                    continue;
                }
                await Category.findOneAndUpdate(query, update, {
                    new: true
                });
            }
        } else {
            for (let id of listOfIds) {
                const query = { _id: id };
                const categoryDoc = await Category.findOne(query)
                if (!categoryDoc) {
                    responseList.push({
                        id: "Not Found"
                    })
                    continue;
                }
                const category = await Category.deleteOne(query);
            }
        }

        res.status(200).send(
            successResponse(200, responseList, 'Category Bulk Update has been updated successfully!')
        )

    }
    catch (err) {
        logger.fatal(err)
        res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
    try {
      let user = await User.findById(id)
      if (!user)
        return res.status(404).send(
            errorResponse(404, "User Not Found")
          )
      req.user = user
      next()
    } catch (err) {
      logger.fatal(err)
      return res.status(400).send(
          errorResponse(400, err.message, "Some issue happened while processing the request")
        )
    }
  }

module.exports = {
    create,
    read,
    readActive,
    list,
    listActive,
    remove,
    update,
    bulk,
    search,
    userByID
}
