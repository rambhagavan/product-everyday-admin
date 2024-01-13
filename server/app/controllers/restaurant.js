const extend = require('lodash/extend');
const Restaurant = require('../models/restaurant');
const { successResponse, errorResponse } = require('../core/response');
const logger = require('../core/logger');

const create = async (req, res) => {
    try {
        const user = req.auth.email
        const name = req.body.name;
        const description = req.body.description;

        if (!description || !name) {
            return res.status(400).send(
                errorResponse(400, null, 'Description/Name is Missing')
            );
        }

        const foundRestaurant = await Restaurant.findOne({ user,name });

        if (foundRestaurant) {
            return res.status(400).send(
                errorResponse(400, null, 'This User Restaurant is already in use.')
            );
        }

        let data = req.body
        data['user'] = req.auth.email

        const restaurant = new Restaurant(data);

        const savedRestaurant = await restaurant.save();

        res.status(200).send(
            successResponse(200, savedRestaurant, `Restaurant has been added successfully!`)
        );

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
        const restaurantId = req.params.id;

        const restaurantDoc = await Restaurant.findOne({ _id: restaurantId })

        if (!restaurantDoc) {
            return res.status(404).send(
                errorResponse(404, null, 'No Restaurant found.')
            )
        }

        res.status(200).send(
            successResponse(200, restaurantDoc, null)
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
        const restaurantId = req.params.id;

        const restaurantDoc = await Restaurant.findOne({ _id: restaurantId, isActive: true })

        if (!restaurantDoc) {
            return res.status(404).send(
                errorResponse(404, null, 'No Restaurant found.')
            )
        }

        res.status(200).send(
            successResponse(200, restaurantDoc, null)
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

        let restaurants = null;
        const restaurantsCount = (await Restaurant.find({}));
        const count = restaurantsCount.length;
        const size = count > limit ? page - 1 : 0;
        const currentPage = count > limit ? Number(page) : 1;
        // paginate query
        const paginateQuery = [
            // { $sort: sortOrder },
            { $skip: size * limit },
            { $limit: limit * 1 }
        ];

        restaurants = await Restaurant.aggregate(paginateQuery);
        res.status(200).send(
            successResponse(
                200,
                {
                    restaurants,
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
        const restaurants = await Restaurant.find({ isActive: true });
        res.status(200).send(
            successResponse(200, restaurants, null)
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
        const restaurantId = req.params.id;
        const update = req.body;
        const query = { _id: restaurantId };
        const restaurantDoc = await Restaurant.findOne(query)

        if (!restaurantDoc) {
            return res.status(404).send(
                errorResponse(404, null, 'No Restaurant found.')
            )
        }

        await Restaurant.findOneAndUpdate(query, update, {
            new: true
        });

        res.status(200).send(
            successResponse(200, null, 'Restaurant has been updated successfully!')
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
        let restaurants = null;
        const restaurantsCount = (await Restaurant.find({}));
        const count = restaurantsCount.length;
        const size = count > limit ? page - 1 : 0;
        const currentPage = count > limit ? Number(page) : 1;

        restaurants = await Restaurant.find({
            $or: [
                { name: { $regex: q, $options: 'i' } }, // Case-insensitive name search
                { description: { $regex: q, $options: 'i' } }, // Case-insensitive description search
            ],
        }).skip(size * limit).limit(limit * 1);

        res.status(200).send(
            successResponse(
                200,
                {
                    restaurants,
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
        const restaurant = await Restaurant.deleteOne({ _id: req.params.id });

        res.status(200).send(
            successResponse(200, restaurant, 'Restaurant has been deleted successfully!')
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
                const restaurantDoc = await Restaurant.findOne(query)
                if (!restaurantDoc) {
                    responseList.push({
                        id: "Not Found"
                    })
                    continue;
                }
                await Restaurant.findOneAndUpdate(query, update, {
                    new: true
                });
            }
        } else {
            for (let id of listOfIds) {
                const query = { _id: id };
                const restaurantDoc = await Restaurant.findOne(query)
                if (!restaurantDoc) {
                    responseList.push({
                        id: "Not Found"
                    })
                    continue;
                }
                const restaurant = await Restaurant.deleteOne(query);
            }
        }

        res.status(200).send(
            successResponse(200, responseList, 'Restaurant Bulk Update has been updated successfully!')
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
    readActive,
    list,
    listActive,
    remove,
    update,
    bulk,
    search
}
