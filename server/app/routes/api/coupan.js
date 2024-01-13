const express = require('express');
const router = express.Router();
const coupanController = require('../../controllers/coupan');

// Bring in Models & Helpers
const auth = require('../../middleware/auth');

// add address api
router.post('/add', auth(), async (req, res) => {
    coupanController.create(req, res)
});

// fetch all addresses api for a user
router.get('/', auth(), async (req, res) => {
    coupanController.list(req, res)
});

// request a address with id
router.get('/:id', auth(), async (req, res) => {
    coupanController.read(req, res)
});

router.put('/:id', auth(), async (req, res) => {
    coupanController.update(req, res)
});

router.delete('/:id', async (req, res) => {
    coupanController.remove(req, res)
});

module.exports = router;
