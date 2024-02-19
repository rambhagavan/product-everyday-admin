const express = require('express');
const router = express.Router();

// Bring in Models & Utils
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { checkValidMongoDbId } = require('../../middleware/db');
const { ROLES } = require('../../constants');
const productController = require('../../controllers/product');

// create store product 
router.post('/add', auth(), role.checkRole(ROLES.Admin), (req, res) => {
  productController.create(req, res);
});

// fetch store categories api
router.get('/list/active', async (req, res) => {
  productController.listActive(req, res);
});

// fetch categories api
router.get('/', async (req, res) => {
  productController.list(req, res);
});

router.get('/search', async (req, res) => {
  productController.search(req, res);
});

router.get('/priceFilter',async (req,res)=>{
  productController.priceFilter(req,res); 
});
// filter by categories wise and food preference wise
router.post('/CategoryProduct', async (req, res) => {
  productController.CategoryProduct(req, res);
});

router.post('/bulk', auth(), role.checkRole(ROLES.Admin), (req, res) => {
  productController.bulk(req, res);
});

// fetch product api
router.get('/:id', checkValidMongoDbId(), async (req, res) => {
  productController.read(req, res);
});


router.put('/:id', auth(), role.checkRole(ROLES.Admin), checkValidMongoDbId(), async (req, res) => {
  productController.update(req, res);
});

router.delete('/:id', auth(), role.checkRole(ROLES.Admin), checkValidMongoDbId(), async (req, res) => {
  productController.remove(req, res);
});


module.exports = router;
