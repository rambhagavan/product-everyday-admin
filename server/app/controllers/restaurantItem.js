const extend = require('lodash/extend');
const RestaurantItem = require('../models/restaurantItem');
const { successResponse, errorResponse } = require('../core/response');
const logger = require('../core/logger');

const create = async (req, res) => {
    try {
        const restaurantItem = new RestaurantItem(req.body);
        const savedRestaurantItem = await restaurantItem.save();
  
        res.status(200).send(
            successResponse(200, savedRestaurantItem, `RestaurantItem has been added successfully!`)
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
        const restaurantItemId = req.params.id;
         
        const restaurantItemDoc = await RestaurantItem.findOne({ _id: restaurantItemId })
       
        if (!restaurantItemDoc) {
            return res.status(404).send(
                errorResponse(404, null, 'No RestaurantItem found.')
            )
        }

        res.status(200).send(
            successResponse(200, restaurantItemDoc, null)
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
        const restaurantItemId = req.params.id;

        const restaurantItemDoc = await RestaurantItem.findOne({ _id: restaurantItemId, isActive: true })

        if (!restaurantItemDoc) {
            return res.status(404).send(
                errorResponse(404, null, 'No RestaurantItem found.')
            )
        }

        res.status(200).send(
            successResponse(200, restaurantItemDoc, null)
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

        let restaurantItems = null;
        const restaurantItemsCount = (await RestaurantItem.find({}));
        const count = restaurantItemsCount.length;
        const size = count > limit ? page - 1 : 0;
        const currentPage = count > limit ? Number(page) : 1;
        // paginate query
        const paginateQuery = [
            // { $sort: sortOrder },
            { $skip: size * limit },
            { $limit: limit * 1 }
        ];

        restaurantItems = await RestaurantItem.aggregate(paginateQuery);
        res.status(200).send(
            successResponse(
                200,
                {
                    restaurantItems,
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

const listRestaurantItem = async (req, res) => {
    try {
        let {
            restaurantId,
            sortOrder,
            page = 1,
            limit = 10
        } = req.query;
        sortOrder = JSON.parse(sortOrder);

        let restaurantItems = null;
        const restaurantItemsCount = (await RestaurantItem.find({ restaurantId: restaurantId }));
        const count = restaurantItemsCount.length;
        const size = count > limit ? page - 1 : 0;
        const currentPage = count > limit ? Number(page) : 1;
        // paginate query
        const paginateQuery = [
            // { $sort: sortOrder },
            { $skip: size * limit },
            // { $limit: 1 * 1 },
            {
                $match: { restaurantId: restaurantId }
            }
        ];

      restaurantItems = await RestaurantItem.aggregate(paginateQuery);
        res.status(200).send(
            successResponse(
                200,
                {
                    restaurantItems,
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
        const restaurantItems = await RestaurantItem.find({ isActive: true });
        res.status(200).send(
            successResponse(200, restaurantItems, null)
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
        const restaurantItemId = req.params.id;
        const update = req.body;
        const query = { _id: restaurantItemId };
        const restaurantItemDoc = await RestaurantItem.findOne(query)
        
        if (!restaurantItemDoc) {
            return res.status(404).send(
                errorResponse(404, null, 'No RestaurantItem found.')
            )
        }

        await RestaurantItem.findOneAndUpdate(query, update, {
            new: true
        });

        res.status(200).send(
            successResponse(200, null, 'RestaurantItem has been updated successfully!')
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
        let restaurantItems = null;
        const restaurantItemsCount = (await RestaurantItem.find({}));
        const count = restaurantItemsCount.length;
        const size = count > limit ? page - 1 : 0;
        const currentPage = count > limit ? Number(page) : 1;

        restaurantItems = await RestaurantItem.find({
            $or: [
                { name: { $regex: q, $options: 'i' } }, // Case-insensitive name search
                { description: { $regex: q, $options: 'i' } }, // Case-insensitive description search
            ],
        }).skip(size * limit).limit(limit * 1);

        res.status(200).send(
            successResponse(
                200,
                {
                    restaurantItems,
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
        const restaurantItem = await RestaurantItem.deleteOne({ _id: req.params.id });

        res.status(200).send(
            successResponse(200, restaurantItem, 'RestaurantItem has been deleted successfully!')
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
                const restaurantItemDoc = await RestaurantItem.findOne(query)
                if (!restaurantItemDoc) {
                    responseList.push({
                        id: "Not Found"
                    })
                    continue;
                }
                await RestaurantItem.findOneAndUpdate(query, update, {
                    new: true
                });
            }
        } else {
            for (let id of listOfIds) {
                const query = { _id: id };
                const restaurantItemDoc = await RestaurantItem.findOne(query)
                if (!restaurantItemDoc) {
                    responseList.push({
                        id: "Not Found"
                    })
                    continue;
                }
                const restaurantItem = await RestaurantItem.deleteOne(query);
            }
        }

        res.status(200).send(
            successResponse(200, responseList, 'RestaurantItem Bulk Update has been updated successfully!')
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
    listRestaurantItem,
    remove,
    update,
    bulk,
    search
}
