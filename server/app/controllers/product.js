const extend = require("lodash/extend");
const slugify = require("slugify");
const Product = require("../models/product");
const { successResponse, errorResponse } = require("../core/response");
const logger = require("../core/logger");

const { skuGenerator, validateMongoDbId } = require("../utils/utils");

const create = async (req, res) => {
  try {
    const name = req.body.name;
    const slug = slugify(name);
    const description = req.body.description;
    const quantity = req.body.quantity;
    const price = req.body.price;
    // new addition
    const category = req.body.category;
    const taxable = req.body.taxable;
    const isActive = req.body.isActive;
    const brand = req.body.brand;
    const image = req.body.image;
    const rating = req.body.rating;
    const foodPreference = req.body.foodPreference;

    const sku = skuGenerator(name);

    if (!sku) {
      return res.status(400).send(errorResponse(400, null, "SKU is Missing"));
    }

    if (!description || !name) {
      return res
        .status(400)
        .send(errorResponse(400, null, "Description/Name is Missing"));
    }

    if (!quantity) {
      return res
        .status(400)
        .send(errorResponse(400, null, "Quantity is Missing"));
    }

    if (!price) {
      return res
        .status(400)
        .send(errorResponse(400, null, "You must enter a price."));
    }

    if (!category) {
      return res
        .status(400)
        .send(errorResponse(400, null, "you must fill the category name"));
    }

    // if(!foodPreference){
    //     return res.status(400).send(
    //         errorResponse(400, null, 'select food preference')
    //     )
    // }

    const foundProduct = await Product.findOne({ sku });

    if (foundProduct) {
      return res
        .status(400)
        .send(errorResponse(400, null, "This sku is already in use."));
    }

    const product = new Product({ ...req.body, sku, slug });

    const savedProduct = await product.save();

    res
      .status(200)
      .send(
        successResponse(
          200,
          savedProduct,
          `Product has been added successfully!`
        )
      );
  } catch (err) {
    logger.fatal(err);
    return res
      .status(400)
      .send(
        errorResponse(
          400,
          err.message,
          "Your request could not be processed. Please try again."
        )
      );
  }
};

const read = async (req, res) => {
  try {
    const productId = req.params.id;

    const productDoc = await Product.findOne({ _id: productId });

    if (!productDoc) {
      return res
        .status(404)
        .send(errorResponse(404, null, "No Product found."));
    }

    res.status(200).send(successResponse(200, productDoc, null));
  } catch (err) {
    logger.fatal(err);
    return res
      .status(400)
      .send(
        errorResponse(
          400,
          err.message,
          "Your request could not be processed. Please try again."
        )
      );
  }
};

const readActive = async (req, res) => {
  try {
    const productId = req.params.id;

    const productDoc = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!productDoc) {
      return res
        .status(404)
        .send(errorResponse(404, null, "No Product found."));
    }

    res.status(200).send(successResponse(200, productDoc, null));
  } catch (err) {
    logger.fatal(err);
    return res
      .status(400)
      .send(
        errorResponse(
          400,
          err.message,
          "Your request could not be processed. Please try again."
        )
      );
  }
};

const list = async (req, res) => {
  try {
    let { sortOrder, page = 1, limit = 10 } = req.query;

    let products = null;
    const productsCount = await Product.find({});
    const count = productsCount.length;
    const size = count > limit ? page - 1 : 0;
    const currentPage = count > limit ? Number(page) : 1;

    if (sortOrder && sortOrder.toLowerCase() === 'asc') {
      products = await Product.find().collation({ locale: 'en' }).sort({ name: 1 }).skip(size * limit).limit(limit * 1);
    } else if (sortOrder && sortOrder.toLowerCase() === 'desc') {
      products = await Product.find().collation({ locale: 'en' }).sort({ name: -1 }).skip(size * limit).limit(limit * 1);
    } else {
      // Default sorting by the first letter of the name in ascending order
      products = await Product.find({}).skip(size * limit).limit(limit * 1);
    }

    res.status(200).send(
      successResponse(
        200,
        {
          products,
          totalPages: Math.ceil(count / limit),
          currentPage,
          count,
        },
        null
      )
    );
  } catch (err) {
    logger.fatal(err);
    res
      .status(400)
      .send(
        errorResponse(
          400,
          err.message,
          "Your request could not be processed. Please try again."
        )
      );
  }
};

const CategoryProduct = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

        const { category } = req.body;
    let products = null;
    const productsCount = await Product.find({});
    const count = productsCount.length;
    const size = count > limit ? page - 1 : 0;
    const currentPage = count > limit ? Number(page) : 1;

    if (!category) {
      return res
        .status(400)
        .json({
          error:
            "Either foodPreference or category must be provided in the request body",
        });
    }

    let query = {};

    if (category) {
      // If category is provided, add it to the query
      if (typeof category === "string") {
        query.category = { $regex: category, $options: "i" };
      } else {
        return res.status(400).json({ error: "category must be a string" });
      }
    }

    products = await Product.find({ $or: [query] })
      .skip(size * limit)
      .limit(limit * 1);

    res.status(200).send(
      successResponse(
        200,
        {
          products,
          totalPages: Math.ceil(count / limit),
          currentPage,
          count,
        },
        null
      )
    );
  } catch (err) {
    logger.fatal(err);
    res
      .status(400)
      .send(
        errorResponse(
          400,
          err.message,
          "Your request could not be processed. Please try again."
        )
      );
  }
};

const priceFilter = async (req, res) => {
  try {

    let { page = 1, limit = 10 } = req.query;
     
    const { category, foodPreference, priceSort } = req.query;

    
    const productsCount = await Product.find({});
    const count = productsCount.length;
    const size = count > limit ? page - 1 : 0;
    const currentPage = count > limit ? Number(page) : 1;


    if (!foodPreference && !category && !priceSort) {
      return res
        .status(400)
        .json({
          error:
            "Either foodPreference or category must be provided in the request body",
        });
    }

    let baseQuery = {};

    if (category && priceSort) {
      baseQuery.category = category;
    }else if(category)
    {
      baseQuery.category=category;
    } 
    else if (foodPreference && priceSort) {
      baseQuery.foodPreference = foodPreference;
    }

    let query = Product.find(baseQuery).skip(size * limit)
    .limit(limit * 1);
;

    if (priceSort === "low-to-high") {
      query = query.sort({ price: 1 });
    } else if (priceSort === "high-to-low") {
      query = query.sort({ price: -1 });
    }

    const products = await query.exec();

    res.status(200).send(
      successResponse(
        200,
        {
          products,
          totalPages: Math.ceil(count / limit),
          currentPage,
          count,
        },
        null
      )
    );
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: 500,
      data: null,
      message: "Your request could not be processed. Please try again.",
    });
  }
};

const listActive = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
     
    const { sortBy } = req.query;

    
    const productsCount = await Product.find({});
    const count = productsCount.length;
    const size = count > limit ? page - 1 : 0;
    const currentPage = count > limit ? Number(page) : 1;


    if (!sortBy) {
      return res
        .status(400)
        .json({
          error:
            " sortBy must be provided in the request body",
        });
    }
    let query = null
;

    if (sortBy === "active") {
      query = Product.find({isActive :true}).skip(size * limit)
    .limit(limit * 1);
    
    } else if (sortBy === "non-active") {
      query = Product.find({isActive :false}).skip(size * limit)
    .limit(limit * 1);
    
    }

    const products = await query.exec();

    res.status(200).send(
      successResponse(
        200,
        {
          products,
          totalPages: Math.ceil(count / limit),
          currentPage,
          count,
        },
        null
      )
    );
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: 500,
      data: null,
      message: "Your request could not be processed. Please try again.",
    });
  }
};

const update = async (req, res) => {
  try {
    const productId = req.params.id;
    const update = req.body;
    const query = { _id: productId };
    const productDoc = await Product.findOne(query);

    if (!productDoc) {
      return res
        .status(404)
        .send(errorResponse(404, null, "No Product found."));
    }

    await Product.findOneAndUpdate(query, update, {
      new: true,
    });

    res
      .status(200)
      .send(
        successResponse(200, null, "Product has been updated successfully!")
      );
  } catch (err) {
    logger.fatal(err);
    res
      .status(400)
      .send(
        errorResponse(
          400,
          err.message,
          "Your request could not be processed. Please try again."
        )
      );
  }
};

const search = async (req, res) => {
  try {
    let { page = 1, limit = 10, q = null } = req.query;
    let products = null;
    const productsCount = await Product.find({});
    const count = productsCount.length;
    const size = count > limit ? page - 1 : 0;
    const currentPage = count > limit ? Number(page) : 1;

    products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } }, // Case-insensitive name search
        { description: { $regex: q, $options: "i" } }, // Case-insensitive description search
      ],
    })
      .skip(size * limit)
      .limit(limit * 1);

    res.status(200).send(
      successResponse(
        200,
        {
          products,
          totalPages: Math.ceil(count / limit),
          currentPage,
          count,
        },
        null
      )
    );
  } catch (err) {
    logger.fatal(err);
    res
      .status(400)
      .send(
        errorResponse(
          400,
          err.message,
          "Your request could not be processed. Please try again."
        )
      );
  }
};

const remove = async (req, res) => {
  try {
    const product = await Product.deleteOne({ _id: req.params.id });

    res
      .status(200)
      .send(
        successResponse(200, product, "Product has been deleted successfully!")
      );
  } catch (err) {
    logger.fatal(err);
    res
      .status(400)
      .send(
        errorResponse(
          400,
          err.message,
          "Your request could not be processed. Please try again."
        )
      );
  }
};

const bulk = async (req, res) => {
  try {
    const listOfIds = req.body.listOfIds;
    const operation = req.body.operation;
    if (operation !== "delete" && operation !== "update") {
      return res
        .status(400)
        .send(errorResponse(400, null, "Unsupported operation"));
    }
    const responseList = [];

    if (operation === "update") {
      const update = req.body.updateData;

      for (let id of listOfIds) {
        const query = { _id: id };
        const productDoc = await Product.findOne(query);
        if (!productDoc) {
          responseList.push({
            id: "Not Found",
          });
          continue;
        }
        await Product.findOneAndUpdate(query, update, {
          new: true,
        });
      }
    } else {
      for (let id of listOfIds) {
        const query = { _id: id };
        const productDoc = await Product.findOne(query);
        if (!productDoc) {
          responseList.push({
            id: "Not Found",
          });
          continue;
        }
        const product = await Product.deleteOne(query);
      }
    }

    res
      .status(200)
      .send(
        successResponse(
          200,
          responseList,
          "Product Bulk Update has been updated successfully!"
        )
      );
  } catch (err) {
    logger.fatal(err);
    res
      .status(400)
      .send(
        errorResponse(
          400,
          err.message,
          "Your request could not be processed. Please try again."
        )
      );
  }
};

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
  priceFilter,
  CategoryProduct,
  
};
