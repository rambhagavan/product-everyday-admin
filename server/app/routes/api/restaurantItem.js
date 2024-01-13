const express = require('express');
const router = express.Router();

// Bring in Models & Utils
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { checkValidMongoDbId } = require('../../middleware/db');
// const store = require('../../utils/store');
const { ROLES } = require('../../constants');
const restaurantItemController = require('../../controllers/restaurantItem');

// create store restaurantItem 
router.post('/add', auth(), role.checkRole(ROLES.Admin), (req, res) => {
  restaurantItemController.create(req, res);
});

// fetch store restaurantItems api
router.get('/list/active', async (req, res) => {
  restaurantItemController.listActive(req, res);
});

// fetch restaurantItems api
router.get('/', async (req, res) => {
  restaurantItemController.list(req, res);
});

router.get('/list/restrauntitems', async (req, res) => {
  restaurantItemController.listRestaurantItem(req, res);
});

router.get('/search', async (req, res) => {
  restaurantItemController.search(req, res);
});

router.post('/bulk', auth(), role.checkRole(ROLES.Admin), (req, res) => {
  restaurantItemController.bulk(req, res);
});

// fetch restaurantItem api
router.get('/:id', checkValidMongoDbId(), async (req, res) => {
  restaurantItemController.read(req, res);
});

router.put('/:id', auth(), role.checkRole(ROLES.Admin), checkValidMongoDbId(), async (req, res) => {
  restaurantItemController.update(req, res);
});

router.delete('/:id', auth(), role.checkRole(ROLES.Admin), checkValidMongoDbId(), async (req, res) => {
  restaurantItemController.remove(req, res);
});



module.exports = router;
