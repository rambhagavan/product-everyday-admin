const extend = require('lodash/extend');
const slugify = require("slugify");
const Product = require('../models/product');
const { successResponse, errorResponse } = require('../core/response');
const logger = require('../core/logger');

const { skuGenerator, validateMongoDbId } = require('../utils/utils');

const create = async (req, res) => {
    try {
        const name = req.body.name;
        const slug = slugify(name);
        const description = req.body.description;
        const quantity = req.body.quantity;
        const price = req.body.price;
        const taxable = req.body.taxable;
        const isActive = req.body.isActive;
        const brand = req.body.brand;
        const image = req.body.image;
        const sku = skuGenerator(name)

        if (!sku) {
            return res.status(400).send(
                errorResponse(400, null, 'SKU is Missing')
            );
        }

        if (!description || !name) {
            return res.status(400).send(
                errorResponse(400, null, 'Description/Name is Missing')
            );
        }

        if (!quantity) {
            return res.status(400).send(
                errorResponse(400, null, 'Quantity is Missing')
            );
        }

        if (!price) {
            return res.status(400).send(
                errorResponse(400, null, 'You must enter a price.')
            );
        }

        const foundProduct = await Product.findOne({ sku });

        if (foundProduct) {
            return res.status(400).send(
                errorResponse(400, null, 'This sku is already in use.')
            );
        }

        const product = new Product({...req.body, sku, slug});

        const savedProduct = await product.save();

        res.status(200).send(
            successResponse(200, savedProduct, `Product has been added successfully!`)
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
        const productId = req.params.id;

        const productDoc = await Product.findOne({ _id: productId })

        if (!productDoc) {
            return res.status(404).send(
                errorResponse(404, null, 'No Product found.')
            )
        }

        res.status(200).send(
            successResponse(200, productDoc, null)
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
        const productId = req.params.id;

        const productDoc = await Product.findOne({ _id: productId, isActive: true })

        if (!productDoc) {
            return res.status(404).send(
                errorResponse(404, null, 'No Product found.')
            )
        }

        res.status(200).send(
            successResponse(200, productDoc, null)
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

        let products = null;
        const productsCount = (await Product.find({}));
        const count = productsCount.length;
        const size = count > limit ? page - 1 : 0;
        const currentPage = count > limit ? Number(page) : 1;
        // paginate query
        const paginateQuery = [
            // { $sort: sortOrder },
            { $skip: size * limit },
            { $limit: limit * 1 }
        ];

        products = await Product.aggregate(paginateQuery);
        res.status(200).send(
            successResponse(
                200,
                {
                    products,
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
        const products = await Product.find({ isActive: true });
        res.status(200).send(
            successResponse(200, products, null)
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
        const productId = req.params.id;
        const update = req.body;
        const query = { _id: productId };
        const productDoc = await Product.findOne(query)

        if (!productDoc) {
            return res.status(404).send(
                errorResponse(404, null, 'No Product found.')
            )
        }

        await Product.findOneAndUpdate(query, update, {
            new: true
        });

        res.status(200).send(
            successResponse(200, null, 'Product has been updated successfully!')
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
        let products = null;
        const productsCount = (await Product.find({}));
        const count = productsCount.length;
        const size = count > limit ? page - 1 : 0;
        const currentPage = count > limit ? Number(page) : 1;

        products = await Product.find({
            $or: [
                { name: { $regex: q, $options: 'i' } }, // Case-insensitive name search
                { description: { $regex: q, $options: 'i' } }, // Case-insensitive description search
            ],
        }).skip(size * limit).limit(limit * 1);

        res.status(200).send(
            successResponse(
                200,
                {
                    products,
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
        const product = await Product.deleteOne({ _id: req.params.id });

        res.status(200).send(
            successResponse(200, product, 'Product has been deleted successfully!')
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
                const productDoc = await Product.findOne(query)
                if (!productDoc) {
                    responseList.push({
                        id: "Not Found"
                    })
                    continue;
                }
                await Product.findOneAndUpdate(query, update, {
                    new: true
                });
            }
        } else {
            for (let id of listOfIds) {
                const query = { _id: id };
                const productDoc = await Product.findOne(query)
                if (!productDoc) {
                    responseList.push({
                        id: "Not Found"
                    })
                    continue;
                }
                const product = await Product.deleteOne(query);
            }
        }

        res.status(200).send(
            successResponse(200, responseList, 'Product Bulk Update has been updated successfully!')
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
