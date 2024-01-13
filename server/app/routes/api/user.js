const express = require('express');
const router = express.Router();

// Bring in Models & Utils
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { checkValidMongoDbId } = require('../../middleware/db');
const userController = require('../../controllers/user');

const { ROLES } = require('../../constants');
const { userByID } = require('../../controllers/user');

router.post('/add', auth(), role.checkRole(ROLES.Admin), (req, res) => {
    userController.create(req, res);
});

router.get('/list/active', auth(), role.checkRole(ROLES.Admin), async (req, res) => {
    userController.listActive(req, res);
});

router.get('/', auth(), role.checkRole(ROLES.Admin), async (req, res) => {
    userController.list(req, res);
});

router.get('/search',auth(), role.checkRole(ROLES.Admin), async (req, res) => {
    userController.search(req, res);
});

router.post('/bulk', auth(), role.checkRole(ROLES.Admin), (req, res) => {
    userController.bulk(req, res);
});

router.get('/:id', auth(), role.checkRole(ROLES.Admin), checkValidMongoDbId(), async (req, res) => {
    userController.read(req, res);
});

router.put('/:id', auth(), role.checkRole(ROLES.Admin), checkValidMongoDbId(), async (req, res) => {
    userController.update(req, res);
});

router.delete('/:id', auth(), role.checkRole(ROLES.Admin), checkValidMongoDbId(), async (req, res) => {
    userController.remove(req, res);
});

router.param('id', userByID)

module.exports = router;
