const express = require('express');
const router = express.Router();

// Bring in Models & Utils
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { checkValidMongoDbId } = require('../../middleware/db');
// const store = require('../../utils/store');
const { ROLES } = require('../../constants');
const categoryController = require('../../controllers/category');

// create store category 
router.post('/add', auth(), role.checkRole(ROLES.Admin), (req, res) => {
  categoryController.create(req, res);
});

// fetch store categories api
router.get('/list/active', async (req, res) => {
  categoryController.listActive(req, res);
});

// fetch categories api
router.get('/', async (req, res) => {
  categoryController.list(req, res);
});

router.get('/search', async (req, res) => {
  categoryController.search(req, res);
});

router.post('/bulk', auth(), role.checkRole(ROLES.Admin), (req, res) => {
  categoryController.bulk(req, res);
});

// fetch category api
router.get('/:id', checkValidMongoDbId(), async (req, res) => {
  categoryController.read(req, res);
});

router.put('/:id', auth(), role.checkRole(ROLES.Admin), checkValidMongoDbId(), async (req, res) => {
  categoryController.update(req, res);
});

router.delete('/:id', auth(), role.checkRole(ROLES.Admin), checkValidMongoDbId(), async (req, res) => {
  categoryController.remove(req, res);
});



module.exports = router;
