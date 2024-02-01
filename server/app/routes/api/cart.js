const express = require('express');
const router = express.Router();

// Bring in Models & Utils
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { checkValidMongoDbId } = require('../../middleware/db');
const { ROLES } = require('../../constants');
const cartController = require('../../controllers/cart');

// add new cart
router.post('/new',auth(), async (req, res) => {
  cartController.create(req, res);
});

// fetch all carts --admin
router.get('/list',auth(), role.checkRole(ROLES.Admin), (req, res) => {
  cartController.list(req, res);
});

//fetch cart info of a user
router.get('/:userId', auth(), async (req, res) => {
  cartController.read(req, res);
}); 

//get cart items
router.get('/:userId/items', auth(), async (req, res) => {
  cartController.listItems(req, res);
});

//add new items to cart
router.post('/:userId/items', auth(), async (req, res) => {
  cartController.update(req, res);
});

//remove items from cart
router.delete('/:userId/items',auth(), async (req, res) => {
  cartController.remove(req, res);
});

//empty the cart when order is placed
router.patch('/:userId', async (req, res) => {
  cartController.emptyCart(req, res);
});

module.exports = router;
