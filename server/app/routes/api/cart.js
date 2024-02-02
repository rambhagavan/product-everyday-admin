const express = require('express');
const router = express.Router();

// Bring in Models & Utils
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { checkValidMongoDbId } = require('../../middleware/db');
const { ROLES } = require('../../constants');
const cartController = require('../../controllers/cart');

// create new cart
router.post('/create',auth(), async (req, res) => {
  cartController.create(req, res);
});

// fetch all carts --admin
router.get('/list',auth(), role.checkRole(ROLES.Admin), (req, res) => {
  cartController.list(req, res);
});

//fetch cart info of a user
router.get('/:id', auth(), checkValidMongoDbId(),  async (req, res) => {
  cartController.read(req, res);
}); 

//get cart items
router.get('/:id/items', auth(), checkValidMongoDbId(), async (req, res) => {
  cartController.listItems(req, res);
});

//add new items to cart
router.post('/:id/items', auth(), checkValidMongoDbId(), async (req, res) => {
  cartController.update(req, res);
});

//remove items from cart
router.delete('/:id/items',auth(), checkValidMongoDbId(), async (req, res) => {
  cartController.remove(req, res);
});

//empty the cart when order is placed
router.patch('/:id', auth(), checkValidMongoDbId(), async (req, res) => {
  cartController.emptyCart(req, res);
});

module.exports = router;
