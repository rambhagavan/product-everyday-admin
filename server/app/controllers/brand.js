const extend = require('lodash/extend');
const slugify = require("slugify");
const Brand = require('../models/brand');
const { successResponse, errorResponse } = require('../core/response');
const logger = require('../core/logger');

const create = async (req, res) => {
    try {
        const name = req.body.name;
        const description = req.body.description;
        const slug = slugify(name);
        const isActive = req.body.isActive;
        const image = req.body.image;
        const brandDoc = await Brand.findOne({ name })

        if (brandDoc) {
            return res.status(400).send(
                errorResponse(400, null, 'Brand with name ' + brandDoc.name + ' already exists')
            )
        }

        if (!description || !name) {
            return res.status(400).send(
                errorResponse(400, null, 'You must enter description & name.')
            )
        }

        const brand = new Brand({
            name,
            slug,
            description,
            isActive,
            image
        });

        await brand.save()
        return res.status(200).send(
            successResponse(200, null, `Brand has been added successfully!`)
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
        const categoryId = req.params.id;

        const brandDoc = await Brand.findOne({ _id: categoryId })

        if (!brandDoc) {
            return res.status(404).send(
                errorResponse(404, null, 'No Brand found.')
            )
        }

        res.status(200).send(
            successResponse(200, brandDoc, null)
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
        const categoryId = req.params.id;

        const brandDoc = await Brand.findOne({ _id: categoryId, isActive: true })

        if (!brandDoc) {
            return res.status(404).send(
                errorResponse(404, null, 'No Brand found.')
            )
        }

        res.status(200).send(
            successResponse(200, brandDoc, null)
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

        let brands = null;
        const brandsCount = (await Brand.find({}));
        const count = brandsCount.length;
        const size = count > limit ? page - 1 : 0;
        const currentPage = count > limit ? Number(page) : 1;
        // paginate query
        const paginateQuery = [
            // { $sort: sortOrder },
            { $skip: size * limit },
            { $limit: limit * 1 }
        ];

        brands = await Brand.aggregate(paginateQuery);
        res.status(200).send(
            successResponse(
                200,
                {
                    brands,
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
        const brands = await Brand.find({ isActive: true });
        res.status(200).send(
            successResponse(200, brands, null)
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
        const categoryId = req.params.id;
        const update = req.body;
        const query = { _id: categoryId };
        const brandDoc = await Brand.findOne(query)

        if (!brandDoc) {
            return res.status(404).send(
                errorResponse(404, null, 'No Brand found.')
            )
        }

        await Brand.findOneAndUpdate(query, update, {
            new: true
        });

        res.status(200).send(
            successResponse(200, null, 'Brand has been updated successfully!')
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
        let brands = null;
        const brandsCount = (await Brand.find({}));
        const count = brandsCount.length;
        const size = count > limit ? page - 1 : 0;
        const currentPage = count > limit ? Number(page) : 1;

        brands = await Brand.find({
            $or: [
                { name: { $regex: q, $options: 'i' } }, // Case-insensitive name search
                { description: { $regex: q, $options: 'i' } }, // Case-insensitive description search
            ],
        }).skip(size * limit).limit(limit * 1);

        res.status(200).send(
            successResponse(
                200,
                {
                    brands,
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
        const brand = await Brand.deleteOne({ _id: req.params.id });

        res.status(200).send(
            successResponse(200, brand, 'Brand has been deleted successfully!')
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
                const brandDoc = await Brand.findOne(query)
                if (!brandDoc) {
                    responseList.push({
                        id: "Not Found"
                    })
                    continue;
                }
                await Brand.findOneAndUpdate(query, update, {
                    new: true
                });
            }
        } else {
            for (let id of listOfIds) {
                const query = { _id: id };
                const brandDoc = await Brand.findOne(query)
                if (!brandDoc) {
                    responseList.push({
                        id: "Not Found"
                    })
                    continue;
                }
                const brand = await Brand.deleteOne(query);
            }
        }

        res.status(200).send(
            successResponse(200, responseList, 'Brand Bulk Update has been updated successfully!')
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
