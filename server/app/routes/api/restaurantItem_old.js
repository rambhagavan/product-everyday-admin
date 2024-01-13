const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const restaurantItemController = require('../../controllers/restaurantItem');

// fetch store restaurants by advanced filters api
router.get('/list', async (req, res) => {
  return restaurantItemController.list(req, res)
});

// fetch restaurant name search api
router.get('/list/search/:name', async (req, res) => {
  return restaurantItemController.search(req, res)
});

router.get('/list/select', auth(), async (req, res) => {
  restaurantItemController.listSelect(req, res)
});

// add restaurant api
router.post('/add', auth(), async (req, res) => {
  restaurantItemController.create(req, res);
}
);

// fetch restaurant slug api
router.get('/:id', async (req, res) => {
  return restaurantItemController.read(req, res)
});

//update restaurant api
router.put(
  '/:id',
  auth(),
  async (req, res) => {
    restaurantItemController.update(req, res);
  }

);

router.put(
  '/:id/active',
  auth(),
  async (req, res) => {
    restaurantItemController.updateActive(req, res);
  }
);

router.delete(
  '/:id',
  auth(),
  async (req, res) => {
    restaurantItemController.remove(req, res);
  }
);


module.exports = router;
