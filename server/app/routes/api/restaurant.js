const express = require('express');
const router = express.Router();

// Bring in Models & Utils
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { checkValidMongoDbId } = require('../../middleware/db');
// const store = require('../../utils/store');
const { ROLES } = require('../../constants');
const restaurantController = require('../../controllers/restaurant');

// create store restaurant 
router.post('/add', auth(), role.checkRole(ROLES.Admin), (req, res) => {
  restaurantController.create(req, res);
});

// fetch store restaurants api
router.get('/list/active', async (req, res) => {
  restaurantController.listActive(req, res);
});

// fetch restaurants api
router.get('/', async (req, res) => {
  restaurantController.list(req, res);
});

router.get('/search', async (req, res) => {
  restaurantController.search(req, res);
});

router.post('/bulk', auth(), role.checkRole(ROLES.Admin), (req, res) => {
  restaurantController.bulk(req, res);
});

// fetch restaurant api
router.get('/:id', checkValidMongoDbId(), async (req, res) => {
  restaurantController.read(req, res);
});

router.put('/:id', auth(), role.checkRole(ROLES.Admin), checkValidMongoDbId(), async (req, res) => {
  restaurantController.update(req, res);
});

router.delete('/:id', auth(), role.checkRole(ROLES.Admin), checkValidMongoDbId(), async (req, res) => {
  restaurantController.remove(req, res);
});



module.exports = router;
