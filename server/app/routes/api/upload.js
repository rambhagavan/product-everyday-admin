const express = require('express');
const router = express.Router();
const uploadController = require('../../controllers/upload');
const { uploadPhoto, productImgResize } = require('../../middleware/upload');

// Bring in Models & Helpers
const auth = require('../../middleware/auth');

// fetch all addresses api for a user
router.post('/',
    auth(),
    uploadPhoto.array("images", 10),
    productImgResize,
    async (req, res) => {
        uploadController.upload(req, res)
    });

router.delete('/:id', async (req, res) => {
    uploadController.remove(req, res)
});

module.exports = router;
