const express = require('express');
const router = express.Router();
const addressController = require('../../controllers/address');

// Bring in Models & Helpers
const auth = require('../../middleware/auth');

// add address api
router.post('/add', auth(), async (req, res) => {
  addressController.create(req,res)
});

// fetch all addresses api for a user
router.get('/', auth(), async (req, res) => {
  addressController.list(req,res)
});

// request a address with id
router.get('/:id', auth(), async (req, res) => {
  addressController.read(req,res)
});

router.put('/:id', auth(),  async (req, res) => {
  addressController.update(req,res)
});

router.delete('/:id', async (req, res) => {
  addressController.remove(req,res)
});

module.exports = router;
