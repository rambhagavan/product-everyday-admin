const extend = require('lodash/extend');
const slugify = require("slugify");
const Category = require('../models/category');
const { successResponse, errorResponse } = require('../core/response');
const logger = require('../core/logger');

const create = async (req, res) => {
    try {
        const name = req.body.name;
        const description = req.body.description;
        const slug = slugify(name);
        const products = req.body.products;
        const isActive = req.body.isActive;
        const image = req.body.image;
        const categoryDoc = await Category.findOne({ name })

        if (categoryDoc) {
            return res.status(400).send(
                errorResponse(400, null, 'Category with name ' + categoryDoc.name + ' already exists')
            )
        }

        if (!description || !name) {
            return res.status(400).send(
                errorResponse(400, null, 'You must enter description & name.')
            )
        }

        const category = new Category({
            name,
            slug,
            description,
            products,
            isActive,
            image
        });

        await category.save()
        return res.status(200).send(
            successResponse(200, null, `Category has been added successfully!`)
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

        const categoryDoc = await Category.findOne({ _id: categoryId })

        if (!categoryDoc) {
            return res.status(404).send(
                errorResponse(404, null, 'No Category found.')
            )
        }

        res.status(200).send(
            successResponse(200, categoryDoc, null)
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

        const categoryDoc = await Category.findOne({ _id: categoryId, isActive: true })

        if (!categoryDoc) {
            return res.status(404).send(
                errorResponse(404, null, 'No Category found.')
            )
        }

        res.status(200).send(
            successResponse(200, categoryDoc, null)
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

        let categories = null;
        const categoriesCount = (await Category.find({}));
        const count = categoriesCount.length;
        const size = count > limit ? page - 1 : 0;
        const currentPage = count > limit ? Number(page) : 1;
        // paginate query
        const paginateQuery = [
            // { $sort: sortOrder },
            { $skip: size * limit },
            { $limit: limit * 1 }
        ];

        categories = await Category.aggregate(paginateQuery);
        res.status(200).send(
            successResponse(
                200,
                {
                    categories,
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
        const categories = await Category.find({ isActive: true });
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
        const categoryId = req.params.id;
        const update = req.body;
        const query = { _id: categoryId };
        const categoryDoc = await Category.findOne(query)

        if (!categoryDoc) {
            return res.status(404).send(
                errorResponse(404, null, 'No Category found.')
            )
        }

        await Category.findOneAndUpdate(query, update, {
            new: true
        });

        res.status(200).send(
            successResponse(200, null, 'Category has been updated successfully!')
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
        let categories = null;
        const categoriesCount = (await Category.find({}));
        const count = categoriesCount.length;
        const size = count > limit ? page - 1 : 0;
        const currentPage = count > limit ? Number(page) : 1;

        categories = await Category.find({
            $or: [
                { name: { $regex: q, $options: 'i' } }, // Case-insensitive name search
                { description: { $regex: q, $options: 'i' } }, // Case-insensitive description search
            ],
        }).skip(size * limit).limit(limit * 1);

        res.status(200).send(
            successResponse(
                200,
                {
                    categories,
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
        const category = await Category.deleteOne({ _id: req.params.id });

        res.status(200).send(
            successResponse(200, category, 'Category has been deleted successfully!')
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
