const Cart = require('../models/cart');
const { successResponse, errorResponse } = require('../core/response');
const logger = require('../core/logger');

// Create a new cart
const create = async (req, res) => {
    const  userId = req.body.id;
    const cartItems = []
    try {
        if (!userId) {
            return res.status(400).send(
                errorResponse(400, null, 'user is Missing')
            );
        }
        let cart = await Cart.findOne({userId: userId})
        console.log(cart);
        if (cart) {
            return res.status(400).send(
                errorResponse(400, null, 'Cart already exists')
            );
        }
        cart = new Cart({userId, cartItems, totalItems:0, totalAmount:0 });

        const savedCart = await cart.save();

        res.status(200).send(
            successResponse(200, savedCart, `Cart has been created successfully!`)
        );

    }
    catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

// Fetch all cart info of a user
const read = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ error: 'Missing userId query parameter' });
          }

        const cartDoc = await Cart.findOne({userId: userId })

        if (!cartDoc) {
            return res.status(404).send(
                errorResponse(404, null, 'No cart found.')
            )
        }

        res.status(200).send(
            successResponse(200, cartDoc, null)
        )
    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

// Fetch all carts --admin
const list = async (req, res) => {
    try {
        let {
            sortOrder,
            page = 1,
            limit = 10
        } = req.query;
        sortOrder = JSON.parse(sortOrder);
        let carts = await Cart.find({});
        const count = carts.length;
        const size = count > limit ? page - 1 : 0;
        const currentPage = count > limit ? Number(page) : 1;
        // paginate query
        const paginateQuery = [
            // { $sort: sortOrder },
            { $skip: size * limit },
            { $limit: limit * 1 }
        ];

        carts = await Cart.aggregate(paginateQuery);
        res.status(200).send(
            successResponse(
                200,
                {
                    carts,
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
};

// Fetch cart items
const listItems = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ error: 'Missing userId query parameter' });
        }

        const cartDoc = await Cart.findOne({userId: userId })

        if (!cartDoc) {
            return res.status(404).send(
                errorResponse(404, null, 'No cart found.')
            )
        }

        res.status(200).send(
            successResponse(200, cartDoc.cartItems, null)
        )
    } catch (error) {
        res.status(500).json({ error: 'There was a server error.' });
    }
};

//add items to cart
const update = async (req, res) => {
    try {
        const {item } = req.body;
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId query parameter' });
        }
        
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const index = cart.cartItems.findIndex((cartItem) => cartItem.productId.toString() === item.productId);
        if (index > -1) {
            // A product with same productId already exists in cart, update quantity
            cart.cartItems[index].quantity += item.quantity;

            cart.markModified('cartItems');
        } else {
            // Product does not exists in cart, add new item
            cart.cartItems.push(item);
        }
        // Recalculate totalItems and totalAmount
        cart.totalItems += item.quantity;
        cart.totalAmount += item.price * item.quantity;

        await cart.save();

        res.status(200).send(
            successResponse(200, cart, 'Item has been added to Cart successfully!')
        )

    }
    catch (err) {
        logger.fatal(err)
        res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

// Remove items from cart
const remove = async (req, res) => {
    try {
        const { item } = req.body;
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ error: 'Missing userId  parameter' });
        }

        const cart = await Cart.findOne({userId: userId })
        if (!cart) {
            return res.status(404).send(
                errorResponse(404, null, 'No cart found.')
            )
        }
        const index = cart.cartItems.findIndex((cartItem) => cartItem.productId.toString() === item.productId);
        if (index === -1) {
            return res.status(404).send(
                errorResponse(404, null, 'Item not found in the cart.')
            )
        }

        // Remove the item from the cart
        cart.cartItems.pop(item);

        // Recalculate totalItems and totalAmount
        cart.totalItems -= item.quantity;
        cart.totalAmount -= item.price * item.quantity;

        await cart.save();
        

        res.status(200).send(
            successResponse(200, cart, 'Item has been deleted successfully!')
        )

    }
    catch (err) {
        logger.fatal(err)
        res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

//empty cart
const emptyCart = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ error: 'Missing userId query parameter' });
        }
        
        const cart = await Cart.findOne({userId: userId })
        if (!cart) {
            return res.status(404).send(
                errorResponse(404, null, 'No cart found.')
            )
        }
        cart.cartItems = [];
        cart.totalItems = 0;
        cart.totalAmount = 0;

        await cart.save();

        res.status(200).send(
            successResponse(200, cart, 'Cart has been emptied successfully!')
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
    list,
    remove,
    update,
    listItems,
    emptyCart
}
