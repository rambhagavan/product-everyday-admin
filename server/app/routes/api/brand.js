const express = require('express');
const router = express.Router();

// Bring in Models & Utils
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { checkValidMongoDbId } = require('../../middleware/db');
const { ROLES } = require('../../constants');
const brandController = require('../../controllers/brand');

// create store brand 
router.post('/add', auth(), role.checkRole(ROLES.Admin), (req, res) => {
  brandController.create(req, res);
});

// fetch store categories api
router.get('/list/active', async (req, res) => {
  brandController.listActive(req, res);
});

// fetch categories api
router.get('/', async (req, res) => {
  brandController.list(req, res);
});

router.get('/search', async (req, res) => {
  brandController.search(req, res);
});

router.post('/bulk', auth(), role.checkRole(ROLES.Admin), (req, res) => {
  brandController.bulk(req, res);
});

// fetch brand api
router.get('/:id', checkValidMongoDbId(), async (req, res) => {
  brandController.read(req, res);
});

router.put('/:id', auth(), role.checkRole(ROLES.Admin), checkValidMongoDbId(), async (req, res) => {
  brandController.update(req, res);
});

router.delete('/:id', auth(), role.checkRole(ROLES.Admin), checkValidMongoDbId(), async (req, res) => {
  brandController.remove(req, res);
});



module.exports = router;
